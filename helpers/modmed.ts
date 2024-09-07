import axios, { AxiosRequestConfig } from 'axios';
import * as env from 'env-var';
import { Condition } from '../services/condition';
import { MedicationStatement } from '../services/medication';
import { ROUTES_OF_ADMINISTRATION } from './constants';
export type StructuredNotes = {
    "Diagnosis": string;
    "ICD Code": string;
    "Onset": string;
    "Timing": string;
    "Locations Affected": string;
    "Worsening Factors": string;
    "Alleviating Factors": string;
    "Associated Symptoms": string;
    "Previous Treatments Tried": string;
    "Current Treatments": string;
    "New Rx Generation": RxGeneration[];
    "Follow-up": string;
  };
  
export type RxGeneration = {
    "Medication Name": string;
    "Dosage": string;
    "RxNorm Code": string;
    "Route of Administration Code": string;
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
    if (!notes['ICD Code']) {
        return [];
    }
    const icdCodeArray = notes['ICD Code'].split(',');
    const diagnosisArray = notes['Diagnosis'].split(',');
    return icdCodeArray.map((code, index) => { return {
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
              "code": code,
              "display": diagnosisArray[index]
            }
          ],
          "text": diagnosisArray[index]
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
    notes['New Rx Generation'].forEach(prescription => {
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
