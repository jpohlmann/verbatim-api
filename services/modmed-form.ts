import { AuthCookies, DiagnosisRequest, DiagnosisResponse, FollowUpData, ProcedureAddResponse, ProcedureData, ProcedureModalResponse} from '../types/modmed-ui';
import axios from 'axios';
import { Condition } from './condition';
import Fuse from 'fuse.js';
import qs from 'qs';
import { findCounselingMedicationInProcedureModal, getCounselingProcedure, getMedicationCounselingProcedure, mapDrugToMedicationConsultation } from '../helpers/modmed';
import { MedicationStatement } from './medication';

// These are words attached to the condition that may not be in the UI.
const EXTRANEOUS_CONDITION_WORDS = ['Unspecified'];

export const PRESCRIPTION_PLAN = {
  "name": "Prescription Medication Management",
  "id": 10379,
  "labelColor": "pink",
  "labelText": "regimen",
  "labelVisible": true,
  "pathologyReq": false,
  "procedureAlias": "RxTreatmentRegimen",
  "requiresBodyLocation": false
};
export const MEDICATION_COUNSELING_PLAN = {
  "name": "Medication Counseling",
  "id": 12810,
  "labelColor": "white",
  "labelText": "counseling",
  "labelVisible": true,
  "pathologyReq": false,
  "procedureAlias": "MedicationCounseling",
  "requiresBodyLocation": false
};
type Diagnosis = {
  diagnosisName: string;
  labelOffsetY: number;
  uncertainDiagnosisName: string;
  labelOffsetX: number;
  labelText: string;
  problemAddressedDisplay: {
    label: string;
    value: string;
  };
  requiresBodyLocation: boolean;
  id: number;
  icd10Match: string;
  diagnosisLabel: string;
  icd9: string;
  icd10: string;
};
export enum AdditionalComments {
  EXAM = 'EXAM',
  CC_HPI = 'CC_HPI',
}
const getSessionCookies = async (): Promise<any> => {
    const response = await axios({
        method: 'get',
        url: 'https://verbatimaisandbox.m2integrationtest.com/ema/ProviderLogin.action'
    });
    
    return parseCookiesFromHeaders(response.headers);
}

/**
 * Log in to the provider UI
 * 
 * @param username 
 * @param password 
 * @param providerUrl 
 */
export const login = async (username: string, password: string, providerUrl: string): Promise<AuthCookies> => {
    try {
        const getCookies = await getSessionCookies();
        const response = await axios({
            method: 'post',
            url: 'https://verbatimaisandbox.m2integrationtest.com/ema/provider-login',
            headers: {
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
              'Accept-Language': 'en-US,en;q=0.9',
              'Cache-Control': 'no-cache',
              'Connection': 'keep-alive',
              'Content-Type': 'application/x-www-form-urlencoded',
              'Origin': 'https://verbatimaisandbox.m2integrationtest.com',
              'Pragma': 'no-cache',
              'Referer': 'https://verbatimaisandbox.m2integrationtest.com/ema/ProviderLogin.action',
              'Sec-Fetch-Dest': 'document',
              'Sec-Fetch-Mode': 'navigate',
              'Sec-Fetch-Site': 'same-origin',
              'Sec-Fetch-User': '?1',
              'Cookie': `gdpr.attempt=provider; JSESSIONID=${getCookies['JSESSIONID']}; CSID=${getCookies['CSID']}`, 
              'Upgrade-Insecure-Requests': '1',
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
              'sec-ch-ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
              'sec-ch-ua-mobile': '?0',
              'sec-ch-ua-platform': '"macOS"'
            },
            data: qs.stringify({
              targetUrl: '',
              username,
              password,
              login: ''
            }),
            withCredentials: true
          });

    // Return cookie values
    return {
        csid: getCookies['CSID'] || null,
        jsessionid: getCookies['JSESSIONID'] || null,
        gdpr: 'provider'
    };
  } catch (error) {
    console.error('Error during login:', error);
  }
}

/**
 * Sends the request to create the diagnosis
 * 
 * @param providerUrl 
 * @param authCookies 
 * @param diagnosis 
 */
export const sendDiagnosisRequest = async (providerUrl: string, authCookies: AuthCookies, diagnosis: DiagnosisRequest): Promise<DiagnosisRequest> => {
    try {
        const response = await axios({
            method: 'post',
            url: `${providerUrl}/ema/ws/v3/visitDiagnosis/with-plan-defaults?selector=allBodyLocations(bodyLocation,dotColor,dotLabel,glyph,isFromProcedure,labelOffsetX,labelOffsetY,svgIndex,visitDiagnosisId),customDdx,overrideNote,deletable,diagnosisAdxs(ddx(title),visitDiagnosisAdxIcd10Values(icd10Value)),diagnosisDdxs(ddx),diagnosisLabelText,diagnosisRxs(dose,fdbDispensableDrugId,frequency,indication,location,quantityQualifier,quantityQualifierCode,routeTransformed,sideEffects),icd10Code,icd10Description,morphologies(diagnosisMorphology),nonDeletableReason,problemAddressedDisplay,visitDiagnosisIcd10Values(id,icd10Value(id)),adxAsNiceString,diagnosisAdxs(ddx),sdxAsNiceString,allBodyLocations(bodyLocation,dotColor,dotLabel,glyph,isFromProcedure,labelOffsetX,labelOffsetY,svgIndex,visitDiagnosisId),allVisitProcedureBodyLocations(bodyLocation,dotColor,dotLabel,glyph,isFromProcedure,labelOffsetX,labelOffsetY,svgIndex,visitDiagnosisId),diagnosisBodyLocations(bodyLocation,dotColor,dotLabel,glyph,isFromProcedure,labelOffsetX,labelOffsetY,svgIndex,visitDiagnosisId),causeDxAsNiceString,ddxAsNiceString,customDdx,deletable,containsPostedCashCharges,problemAddressedDisplay,icd10ExpertDto,diagnosis(diagnosisLabel,diagnosisType,icd9,problemAddressedDisplay,requiresBodyLocation,specialDiagnosisType,switchDiagramChild,switchDiagramFemale,switchDiagramMale,visualDxId,visualDxModuleId,diagnosisScaleMeasurementsForVe),diagnosisMeasurementOutcomes(diagnosisScaleMeasurement(title),scaleMeasurementValue(title,value)),diagnosisRxs(quantityQualifier),diagnosisStatus,hasOverrideNote,isExistingWithNewProblem,isNew,isRuleout,morphologies(diagnosisMorphology),newMethodOfDisplayingVisitMorphologiesAsNiceString,nonDeletableReason,overrideNote,procedures(allowDeleteBodyLocation,associateToImpression,clinicalNotesToTheLab,hasLinkedPdf,isResumableFromVisitOverview,veVisitDiagnosisProcedureStatusDto,veVisitPostedCashCharge,orderOnly,planDate,procedureBodyLocations(bodyLocation,bodyLocationDescriptionWithOverride,dotColor,dotLabel,glyph,hasLabOrderRecalled,hasResult,isMovable,isResumable,labelOffsetX,labelOffsetY,svgIndex),visitProcedureAlertDescriptions,veProcedure(labelVisible,linkedPdfCustomName,pathologyReq,procedureAlias,requiresBodyLocation,switchDiagramChild,switchDiagramFemale,switchDiagramMale,visible),visitDiagnosisCompendiumTests(comment,compendiumTestDescription),visitDiagnosisIntegrationTests(comment,integrationLabTest),visitDiagnosisLabSets(veLabSetName),visitDiagnosisLabs(loinc)),visitBodyLocationsAsNiceString,diagnosisDdxs(ddx),visitDiagnosisAdxLabel,visitDiagnosisSdxLabel,visitDiagnosisAssociatedTests(associatedTestVisitDiagnosisProcedure),visitDiagnosisCauseDxLabel,visitDiagnosisFaxes(firmUserSpecialty(specialtyType(specialtyName),referralPerson(fullNameComplete))),visitDiagnosisReferrals(firmUserSpecialty(specialtyType(specialtyName),referralPerson(fullNameComplete))),visitMorphologiesAsNiceString,customDdx,diagnosisDdxs(ddx),isRuleout,morphologies(diagnosisMorphology),problemAddressedDisplay`,
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Accept-Language': 'en-US,en;q=0.9',
              'Cache-Control': 'no-cache',
              'Connection': 'keep-alive',
              'Content-Type': 'application/json',
              'Origin': providerUrl,
              'Pragma': 'no-cache',
              'Referer': `${providerUrl}/ema/web/practice/staff`,
              'Sec-Fetch-Dest': 'empty',
              'Sec-Fetch-Mode': 'cors',
              'Sec-Fetch-Site': 'same-origin',
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
              'sec-ch-ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
              'sec-ch-ua-mobile': '?0',
              'sec-ch-ua-platform': '"macOS"',
              'Cookie': `CSID=${authCookies.csid}; JSESSIONID=${authCookies.jsessionid}; gdpr=${authCookies.gdpr}`
            },
            data: diagnosis
          });
        return response.data;
    } catch (error) {
        console.error('Error making request:', error);
    }
}

/**
 * From the ICD code, find the diagnosis
 * 
 * @param condition 
 * @param visitId 
 * @param providerUrl 
 * @param authCookies 
 */
export const findDiagnosisByICDCode = async (condition: Condition, visitId: number, providerUrl: string, authCookies: AuthCookies): Promise<Diagnosis> => {
  let conditionText = condition.code.text;

  // Remove extraneous words from the condition
  EXTRANEOUS_CONDITION_WORDS.forEach(word => conditionText = conditionText.replace(word, ''));
  conditionText = conditionText.trim();
  const headers = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Content-Type': 'application/json',
    'Origin': providerUrl,
    'Pragma': 'no-cache',
    'Referer': `${providerUrl}/ema/web/practice/staff`,
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    'sec-ch-ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'Cookie': `CSID=${authCookies.csid}; JSESSIONID=${authCookies.jsessionid}; gdpr=${authCookies.gdpr}`
  };
  try {
    let response = await axios({
        method: 'get',
        url: `${providerUrl}/ema/ws/v3/diagnosis/ema/dx?selector=id,diagnosisLabel,diagnosisName,icd10Match,icd9,icd10,problemAddressedDisplay,requiresBodyLocation,switchDiagramChild,switchDiagramFemale,switchDiagramMale&visitId=${visitId}&searchTerm=${condition.code.coding[0].code.trim()}&paging.pageNumber=1&paging.pageSize=50`,
        headers
      });
      if (!response.data.length) {
        // Fall back to text search
        response = await axios({
          method: 'get',
          url: `${providerUrl}/ema/ws/v3/diagnosis/ema/dx?selector=id,diagnosisLabel,diagnosisName,icd10Match,icd9,icd10,problemAddressedDisplay,requiresBodyLocation,switchDiagramChild,switchDiagramFemale,switchDiagramMale&visitId=${visitId}&searchTerm=${conditionText}&paging.pageNumber=1&paging.pageSize=50`,
          headers
        });
        // If we still didn't find anything, nothing we can do
        if (!response.data.length) {
          return null;
        }
      }
      const fuse = new Fuse(response.data, { keys: ['diagnosisName'], threshold: 0.3 });
      const results = fuse.search(conditionText);
      if (results.length == 0) {
        // If we didn't get a good match, just pick the first
        return response.data[0];
      }
      return results[0].item as Diagnosis;
} catch (error) {
    console.error('Error making request:', error);
}

}
// Extract cookies from the response headers
const parseCookiesFromHeaders = (headers) => {
    const setCookieHeader = headers['set-cookie'];
    let cookies = {};

    if (setCookieHeader) {
        setCookieHeader.forEach(cookie => {
        const cookieParts = cookie.split(';')[0].split('=');
        cookies[cookieParts[0]] = cookieParts[1];
        });
    }
    return cookies;
}

/**
 * Converts the condition, which comes from the API, to a diagnosis, which is in their UI
 * 
 * @param condition 
 * @param visitId 
 * @param providerUrl 
 * @param loginCookies 
 * @param medications 
 * @param procedures 
 */
export const createDiagnosisFromCondition = async (condition: Condition, visitId: number, providerUrl: string, loginCookies: AuthCookies, medications: Array<MedicationStatement>, procedures: Array<ProcedureData> = []): Promise<DiagnosisRequest> => {
  const diagnosisResult = await findDiagnosisByICDCode(condition, visitId, providerUrl, loginCookies);
  if (medications.length > 0) {
    procedures.push(
      {
        procedure: 'Prescription',
        veProcedure: PRESCRIPTION_PLAN,
        procedureBodyLocations: []
      }
    );
  }
  const diagnosisRequest: DiagnosisRequest = {
    visit: {
      id: visitId
    },
    diagnosisName: diagnosisResult.diagnosisName,
    diagnosis: diagnosisResult,
    diagnosisBodyLocations: [],
    procedures
  };
  let newDiagnosis = await sendDiagnosisRequest(providerUrl, loginCookies, diagnosisRequest);
  newDiagnosis = await addCounselingToDiagnosis(newDiagnosis, medications, providerUrl, loginCookies, visitId);
  await updateMedicationConsultingFromMedicationStatement(newDiagnosis, medications, providerUrl, loginCookies, visitId);
  return newDiagnosis;
}

/**
 * This handles both the CC_HPI comment and the exam comment, if we ever want to add that
 * 
 * @param note 
 * @param providerUrl 
 * @param authCookies 
 * @param visitId 
 * @param additionalCommentType 
 */
export const addAdditionalComments = async (note: string, providerUrl: string, authCookies: AuthCookies, visitId: number, additionalCommentType: AdditionalComments): Promise<boolean> => {
  try {
    const response = await axios({
        method: 'post',
        url: `${providerUrl}/ema/ws/v3/visit-additional-comments/${visitId}/${additionalCommentType}`,
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Content-Type': 'text/plain',
          'Origin': providerUrl,
          'Pragma': 'no-cache',
          'Referer': `${providerUrl}/ema/web/practice/staff`,
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-origin',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
          'sec-ch-ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'Cookie': `CSID=${authCookies.csid}; JSESSIONID=${authCookies.jsessionid}; gdpr=${authCookies.gdpr}`
        },
        data: note
      });
    return response.data;
} catch (error) {
    console.error('Error making request:', error);
}
}

/**
 * Pulls the procedure data so we can look for the matching procedure
 * 
 * @param providerUrl 
 * @param authCookies 
 * @param visitId 
 * @param visitDiagnosisProcedureId 
 */
export const getProcedureModal = async (providerUrl: string, authCookies: AuthCookies, visitId: number, visitDiagnosisProcedureId: number): Promise<ProcedureModalResponse> => {
  try {
    const response = await axios({
        method: 'get',
        url: `${providerUrl}/ema/ws/v3/procedure-modal?visitId=${visitId}&selector=veProcedureFacade&veVisitDiagnosisProcedureId=${visitDiagnosisProcedureId}`,
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Content-Type': 'text/plain',
          'Origin': providerUrl,
          'Pragma': 'no-cache',
          'Referer': `${providerUrl}/ema/web/practice/staff`,
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-origin',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
          'sec-ch-ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'Cookie': `CSID=${authCookies.csid}; JSESSIONID=${authCookies.jsessionid}; gdpr=${authCookies.gdpr}`
        }
      });
    return response.data;
  } catch (error) {
      console.error('Error making request:', error);
  }
}

/**
 * Finds and adds the medication consultation data
 * 
 * @param providerUrl 
 * @param authCookies 
 * @param visitId 
 * @param visitDiagnosisProcedureId 
 * @param drugName 
 */
export const addMedicationConsultation = async (providerUrl: string, authCookies: AuthCookies, visitId: number, visitDiagnosisProcedureId: number, drugName: string): Promise<ProcedureAddResponse|boolean> => {
  try {
    const procedureModalResult = await getProcedureModal(providerUrl, authCookies, visitId, visitDiagnosisProcedureId);
    const counselingMedication = findCounselingMedicationInProcedureModal(mapDrugToMedicationConsultation(drugName), procedureModalResult, visitDiagnosisProcedureId);
    if (!counselingMedication) {
      console.log(`Medication ${drugName} not found`);
      return false;
    }
    const response = await axios({
        method: 'post',
        url: `${providerUrl}/ema/ws/v3/visit/diagnosis/procedures`,
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Content-Type': 'application/json',
          'Origin': providerUrl,
          'Pragma': 'no-cache',
          'Referer': `${providerUrl}/ema/web/practice/staff`,
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-origin',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
          'sec-ch-ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'Cookie': `CSID=${authCookies.csid}; JSESSIONID=${authCookies.jsessionid}; gdpr=${authCookies.gdpr}`
        },
        data: counselingMedication
      });
    return response.data;
  } catch (error) {
      console.error('Error making request:', error);
  }
}

/**
 * Finds a procedure by the diagnosis id
 * 
 * @param diagnosisId 
 * @param providerUrl 
 * @param authCookies 
 * @param visitId 
 */
export const getSuggestedProcedures = async (diagnosisId: number, providerUrl: string, authCookies: AuthCookies, visitId: number): Promise<FollowUpData> => {
  try {
    console.log('DIAGNOSIS ID', diagnosisId);
    const response = await axios({
        method: 'get',
        url: `${providerUrl}/ema/ws/v3/diagnosis/info/suggested-procedures/${diagnosisId}?selector=suggestedProcedures(id,label,pathologyReq,popular,procedureAlias,procedureCount,procedureName,requiresBodyLocation,switchDiagramChild,switchDiagramFemale,switchDiagramMale,title)&visitId=${visitId}`,
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Content-Type': 'application/json',
          'Origin': providerUrl,
          'Pragma': 'no-cache',
          'Referer': `${providerUrl}/ema/web/practice/staff`,
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-origin',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
          'sec-ch-ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'Cookie': `CSID=${authCookies.csid}; JSESSIONID=${authCookies.jsessionid}; gdpr=${authCookies.gdpr}`
        }
      });
    return response.data;
  } catch (error) {
      console.error('Error making request:', error);
  }
}

/**
 * Adds the non-medication counseling data to the diagnosis
 * 
 * @param diagnosis 
 * @param medicationStatements 
 * @param providerUrl 
 * @param authCookies 
 * @param visitId 
 */
export const addCounselingToDiagnosis = async (diagnosis: DiagnosisRequest, medicationStatements: Array<MedicationStatement>, providerUrl: string, authCookies: AuthCookies, visitId: number): Promise<DiagnosisRequest> => {
  const suggestedProcedures = await getSuggestedProcedures(diagnosis.diagnosis.id, providerUrl, authCookies, visitId);
  const counselingProcedure = getCounselingProcedure(suggestedProcedures, diagnosis.diagnosisName);
  if (counselingProcedure) {
    diagnosis.procedures.push(counselingProcedure);
  }
  medicationStatements.forEach(statement => {
    diagnosis.procedures.push(getMedicationCounselingProcedure(suggestedProcedures));
  });
  return await sendDiagnosisRequest(providerUrl, authCookies, diagnosis);
}

/**
 * Based on the medication statement data, pull the medication consultation
 * @param diagnosis 
 * @param medicationStatements 
 * @param providerUrl 
 * @param authCookies 
 * @param visitId 
 */
export const updateMedicationConsultingFromMedicationStatement = async (diagnosis: DiagnosisRequest, medicationStatements: Array<MedicationStatement>, providerUrl: string, authCookies: AuthCookies, visitId: number): Promise<void> => {
  let usedMedicationConsults = [];
  for (const statement of medicationStatements) {
    const medicationConsult = diagnosis.procedures.find(procedure => procedure.procedure == "Medication Counseling" && !usedMedicationConsults.includes(procedure.veProcedure.id)); 
    await addMedicationConsultation(providerUrl, authCookies, visitId, medicationConsult.id, statement.medicationCodeableConcept.text);
    usedMedicationConsults.push(medicationConsult.veProcedure.id);
  }
}