import axios, { AxiosRequestConfig } from 'axios';
import * as env from 'env-var';
import { Condition } from '../services/condition';
import { MedicationStatement } from '../services/medication';
import { ROUTES_OF_ADMINISTRATION } from './constants/route-of-administration';
import { MAPPED_DRUGS } from './constants/medication-consultation';
import Fuse from 'fuse.js';
import { FollowUpData, ProcedureData, ProcedureModalResponse, VisitProcedure, VisitProcedureMetadataOption } from '../types/modmed-ui';

export type StructuredNotes = {
  "Structured Notes": {
    "Patient Info": {
      "CC_HPI": string;
    };
    "Diagnoses": Array<{
      "Diagnosis": string;
      "ICD10_Code": string;
    }>;
    "Onset": string;
    "Timing": string;
    "Symptoms": {
      "Locations Affected": string[];
      "Worsening Factors": string[];
      "Alleviating Factors": string[];
      "Associated Symptoms": string[];
    };
    "Treatments": {
      "Previous Treatments": string[];
      "Current Treatments": string[];
    };
    "New Medications": Array<{
      "Medication Name": string;
      "Dosage": string;
      "Application Instructions": string;
      "Route of Administration Code": string;
      "RxNorm Code": string;
    }>;
    "Follow-up": string;
  };
};

export const buildModMedRequest = (
    endpoint: string, 
    method: string, 
    firmId: string, 
    accessToken: string
) : AxiosRequestConfig => {
    return {
        url: `https://${env.get('DOMAIN_URL').asString()}/ema-dev/firm/${firmId}/ema/fhir/v2${endpoint}`,
        method,
        headers: {
            'x-api-key': env.get('X_API_KEY').required().asString(),
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
        }
    };
};

export const getConditionFromStructuredNotes = (notes: StructuredNotes, firmId: string, patientId: number): Array<Condition> => {
    if (!notes['Structured Notes']['Diagnoses']) {
      return [];
    }
  notes['Structured Notes']['Diagnoses']
  .map((diagnosis) => { return {
        "resourceType": "Condition",
        "clinicalStatus": {
          "coding": [
            {
              "system": "http://hl7.org/fhir/ValueSet/condition-clinical",
              "code": "ACTIVE",
              "display": "Active"
            }
          ],
          "text": "Active"
        },
        "category": [
          {
            "coding": [
              {
                "system": `https://${env.get('DOMAIN_URL').asString()}/ema-dev/firm/${firmId}/ema/fhir/v2/ValueSet/condition-category`,
                "code": "CONDITION",
                "display": "Condition"
              }
            ],
            "text": "Condition"
          }
        ],
        "code": {
          "coding": [
            {
              "system": "ICD10",
              "code": diagnosis['ICD10_Code'],
              "display": diagnosis['Diagnosis']
            }
          ],
          "text": diagnosis['Diagnosis']
        },
        "subject": {
          "reference": `https://${env.get('DOMAIN_URL').asString()}/ema-dev/firm/${firmId}/ema/fhir/v2/Patient/${patientId}`,
          "display": `https://${env.get('DOMAIN_URL').asString()}/ema-dev/firm/${firmId}/ema/fhir/v2/Patient/${patientId}`
        },
        // TODO: Need to figure out onset date
        "onsetDateTime": "2024-02-14T10:21:14+00:00",
        "recordedDate": "2024-02-14T15:21:14+00:00"
      }});
} 
export const getMedicationFromStructuredNotes = (notes: StructuredNotes, firmId: string, patientId: number): Array<MedicationStatement> => {
    if (!notes['New Rx Generation'] || notes['New Rx Generation'].length == 0) {
        return [];
    }
    const medicationStatements: Array<MedicationStatement> = [];
    notes['Structured Notes']['New Medications'].forEach(prescription => {
        if (prescription['RxNorm Code'] == 'Not found') {
          console.log('Medication not found: ' + prescription['Medication Name']);
          return;
        }
        medicationStatements.push({
            "resourceType": "MedicationStatement",
            "status": "active",
            "medicationCodeableConcept": {
              "coding": [
                {
                  "system": "RxNorm",
                  "code": prescription['RxNorm Code'],
                  "display": prescription['Medication Name']
                }
              ],
              "text": prescription['Medication Name']
            },
            "subject": {
              "reference": `https://${env.get('DOMAIN_URL').asString()}/ema-dev/firm/${firmId}/ema/fhir/v2/Patient/${patientId}`,
              "display": `https://${env.get('DOMAIN_URL').asString()}/ema-dev/firm/${firmId}/ema/fhir/v2/Patient/${patientId}`
            },
            "dosage": [
              {
                "route": {
                  "coding": [
                    {
                      "system": "FDARouteOfAdministration",
                      "code": prescription['Route of Administration Code'],
                      "display": ROUTES_OF_ADMINISTRATION[prescription['Route of Administration Code']]
                    }
                  ],
                  "text": ROUTES_OF_ADMINISTRATION[prescription['Route of Administration Code']]
                }
              }
            ]
          });
    });
    return medicationStatements;
}
export const extractUUID = (inputString: string, fileType = 'json'): string|null => {
  let pattern = /transcriptions\/([a-f\d-]+)\.json/;
  // Too lazy to figure out how to concat into a regex currently.
  if (fileType == 'm4a') {
    pattern = /recordings\/([a-f\d-]+)\.m4a/;
  }
  const match = inputString.match(pattern);
  if (match && match.length > 1) {
    return match[1];
  } else {
    return null;
  }
}

export const findCounselingMedicationInProcedureModal = (
  medicationName: string, 
  visitDiagnosisResponse: ProcedureModalResponse,
  procedureNoteId: number
): VisitProcedure|boolean => {
  const cbtextareas = visitDiagnosisResponse.veProcedureFacade.metadata
    .filter(metadata => metadata.type == 'cbtextarea');
    for (const metadata of cbtextareas) {

    const fuse = new Fuse(metadata.options as VisitProcedureMetadataOption[], {includeScore: true, threshold: 0.4, keys: ['optionValue']});
    const results = fuse.search(medicationName);
    if (results.length > 0) {
      const visitProcedure: VisitProcedure = {
        id: procedureNoteId,
        veVisitProcedureMetadataResponse: [
          {
            id: metadata.veVisitProcedureMetadataResponseId,
            veProcedureMetadata: {
              id: metadata.id
            },
            veVisitProcedureMetadataOptionResponses: [
              {
                veProcedureMetadataOption: {
                  id: results[0].item.id
                },
                textareaValue: results[0].item?.textAreaValue
              }
            ]
          }
        ],
        visitProcedureAlerts: []
      };
      console.log('Found visit procedure', JSON.stringify(visitProcedure));
      return visitProcedure;
    }
  }
  return false;
} 
export const getCounselingProcedure = (followupData: FollowUpData, diagnosis: string): ProcedureData => {
  const result = followupData.suggestedProcedures.filter(procedure => 
    procedure.labelText == 'counseling' 
      && procedure.procedureName.startsWith('Counseling -')
    );
  return {
    procedure: result[0].label,
    veProcedure: {
      ...result[0],
      name: result[0].label
    },
    procedureBodyLocations: []
  };
}

export const getMedicationCounselingProcedure = (followupData: FollowUpData): ProcedureData => {
  const result = followupData.suggestedProcedures.find(procedure => procedure.procedureAlias == 'MedicationCounseling');
  return {
    procedure: result.label,
    veProcedure: {
      ...result,
      name: result.label
    },
    procedureBodyLocations: []
  };
}

export const mapDrugToMedicationConsultation = (drugName: string): string => {
  if (MAPPED_DRUGS[drugName.toLowerCase()]) {
    return MAPPED_DRUGS[drugName.toLowerCase()];
  }
  return drugName;
}