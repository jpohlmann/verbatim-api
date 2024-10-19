import { addAdditionalComments, AdditionalComments, addMedicationConsultation, createDiagnosisFromCondition, findDiagnosisByICDCode, getProcedureModal, getSuggestedProcedures, login, PRESCRIPTION_PLAN, sendDiagnosisRequest } from "./modmed-form";
import { DiagnosisRequest } from "../types/modmed-ui";
import {expect, test} from '@jest/globals';
import { Condition } from "./condition";
/*
test('Creates Visit Diagnosis', async () => {
    const username = 'dcane';
    const password = 'Password1234';
    const providerUrl = 'https://verbatimaisandbox.m2integrationtest.com';    
    const loginCookies = await login(username, password, providerUrl);
    expect(loginCookies.gdpr).toBeTruthy();
    expect(loginCookies.csid).toBeTruthy();
    expect(loginCookies.jsessionid).toBeTruthy();

    const diagnosisRequest: DiagnosisRequest = {
        visit: {
          id: 294569
        },
        diagnosisName: 'Warts',
        diagnosis: {
          diagnosisName: 'Warts',
          labelOffsetY: 0,
          uncertainDiagnosisName: 'Neoplasm of Uncertain Behavior',
          labelOffsetX: 0,
          labelText: 'wart',
          requiresBodyLocation: false,
          id: 28121,
          diagnosisLabel: 'wart',
          icd9: '078.10'
        },
        diagnosisBodyLocations: [],
        procedures: [
          {
            procedure: 'Prescription',
            veProcedure: PRESCRIPTION_PLAN,
            procedureBodyLocations: []
          }
        ]
      };
      const diagnosisResult = await sendDiagnosisRequest(providerUrl, loginCookies, diagnosisRequest);
      expect(diagnosisResult.diagnosisName).toEqual('Warts');
});

test('Finds diagnosis by ICD code', async () => {
  const username = 'dcane';
  const password = 'Password1234';
  const visitId = 298750;
  const providerUrl = 'https://verbatimaisandbox.m2integrationtest.com';    
  const loginCookies = await login(username, password, providerUrl);
  expect(loginCookies.gdpr).toBeTruthy();
  expect(loginCookies.csid).toBeTruthy();
  expect(loginCookies.jsessionid).toBeTruthy();

  const condition: Condition = {"resourceType":"Condition","clinicalStatus":{"coding":[{"system":"http://hl7.org/fhir/ValueSet/condition-clinical","code":"ACTIVE","display":"Active"}],"text":"Active"},"category":[{"coding":[{"system":"https://stage.ema-api.com/ema-dev/firm/verbatimaisandbox/ema/fhir/v2/ValueSet/condition-category","code":"CONDITION","display":"Condition"}],"text":"Condition"}],"code":{"coding":[{"system":"ICD10","code":" L21","display":" Seborrheic Dermatitis"}],"text":" Seborrheic Dermatitis"},"subject":{"reference":"https://stage.ema-api.com/ema-dev/firm/verbatimaisandbox/ema/fhir/v2/Patient/340953","display":"https://stage.ema-api.com/ema-dev/firm/verbatimaisandbox/ema/fhir/v2/Patient/340953"},"onsetDateTime":"2024-02-14T10:21:14+00:00","recordedDate":"2024-02-14T15:21:14+00:00"};
    const diagnosisResult = await findDiagnosisByICDCode(condition, visitId, providerUrl, loginCookies);
    expect(diagnosisResult.diagnosisName).toEqual('Seborrheic Dermatitis');
});

test('Finds Eczema diagnosis by ICD code', async () => {
  const username = 'dcane';
  const password = 'Password1234';
  const visitId = 298750;
  const providerUrl = 'https://verbatimaisandbox.m2integrationtest.com';    
  const loginCookies = await login(username, password, providerUrl);
  expect(loginCookies.gdpr).toBeTruthy();
  expect(loginCookies.csid).toBeTruthy();
  expect(loginCookies.jsessionid).toBeTruthy();

  const condition: Condition = {"resourceType":"Condition","clinicalStatus":{"coding":[{"system":"http://hl7.org/fhir/ValueSet/condition-clinical","code":"ACTIVE","display":"Active"}],"text":"Active"},"category":[{"coding":[{"system":"https://stage.ema-api.com/ema-dev/firm/verbatimaisandbox/ema/fhir/v2/ValueSet/condition-category","code":"CONDITION","display":"Condition"}],"text":"Condition"}],"code":{"coding":[{"system":"ICD10","code":"L30.9","display":"Chronic Eczema"}],"text":"Chronic Eczema"},"subject":{"reference":"https://stage.ema-api.com/ema-dev/firm/verbatimaisandbox/ema/fhir/v2/Patient/340953","display":"https://stage.ema-api.com/ema-dev/firm/verbatimaisandbox/ema/fhir/v2/Patient/340953"},"onsetDateTime":"2024-02-14T10:21:14+00:00","recordedDate":"2024-02-14T15:21:14+00:00"};
    const diagnosisResult = await findDiagnosisByICDCode(condition, visitId, providerUrl, loginCookies);
    expect(diagnosisResult.diagnosisName).toEqual('Dermatitis Unspecified');
});
test('Adds additional comment to visit', async () => {
  const username = 'dcane';
  const password = 'Password1234';
  const visitId = 301506;
  const hpiNote = "Rash on neck";
  const examNote = "tinea versicolor on the left inferior lateral neck.";
  const providerUrl = 'https://verbatimaisandbox.m2integrationtest.com';    
  const loginCookies = await login(username, password, providerUrl);
  expect(loginCookies.gdpr).toBeTruthy();
  expect(loginCookies.csid).toBeTruthy();
  expect(loginCookies.jsessionid).toBeTruthy();
    // Exam additional comment
    const examCommentResult = await addAdditionalComments(examNote, providerUrl, loginCookies, visitId, AdditionalComments.EXAM);
    expect(examCommentResult).toEqual(true);
    // CC_HPI additional comment
    const hpiCommentResult = await addAdditionalComments(hpiNote, providerUrl, loginCookies, visitId, AdditionalComments.EXAM);
    expect(hpiCommentResult).toEqual(true);
});

test('Gets procedure modal', async () => {
  const username = 'dcane';
  const password = 'Password1234';
  const visitId = 301506;
  const veVisitDiagnosisProcedureId = 1589;
  const providerUrl = 'https://verbatimaisandbox.m2integrationtest.com';    
  const loginCookies = await login(username, password, providerUrl);
  expect(loginCookies.gdpr).toBeTruthy();
  expect(loginCookies.csid).toBeTruthy();
  expect(loginCookies.jsessionid).toBeTruthy();
  // Getting the procedure modal
  const getProcedureModalResult = await getProcedureModal(providerUrl, loginCookies, visitId, veVisitDiagnosisProcedureId);
  expect(getProcedureModalResult.veProcedureFacade.metadata.length).toBeGreaterThan(1);
});

test('Adds counseling data', async () => {
  const username = 'dcane';
  const password = 'Password1234';
  const visitId = 301506;
  const veVisitDiagnosisProcedureId = 1593;
  const drugName = 'Ketoconazole';
  const providerUrl = 'https://verbatimaisandbox.m2integrationtest.com';    
  const loginCookies = await login(username, password, providerUrl);
  expect(loginCookies.gdpr).toBeTruthy();
  expect(loginCookies.csid).toBeTruthy();
  expect(loginCookies.jsessionid).toBeTruthy();
  // Getting the procedure modal
  const addMedicationConsultationResult = await addMedicationConsultation(providerUrl, loginCookies, visitId, veVisitDiagnosisProcedureId, drugName);
  expect(addMedicationConsultationResult.id).toEqual(veVisitDiagnosisProcedureId);
  expect(addMedicationConsultationResult.procedure).toEqual('Medication Counseling');
});

test('Gets suggested procedures', async () => {
  const username = 'dcane';
  const password = 'Password1234';
  const visitId = 301506;
  const diagnosisId = 28121;
  const providerUrl = 'https://verbatimaisandbox.m2integrationtest.com';    
  const loginCookies = await login(username, password, providerUrl);
  expect(loginCookies.gdpr).toBeTruthy();
  expect(loginCookies.csid).toBeTruthy();
  expect(loginCookies.jsessionid).toBeTruthy();
  // Getting the procedure modal
  const suggestedProceduresResult = await getSuggestedProcedures(diagnosisId, providerUrl, loginCookies, visitId);
  expect(suggestedProceduresResult.suggestedProcedures.length).toBeGreaterThan(1);
});
*/

test('Create Diagnosis from Condition', async () => {
  const condition = {"resourceType":"Condition","clinicalStatus":{"coding":[{"system":"http://hl7.org/fhir/ValueSet/condition-clinical","code":"ACTIVE","display":"Active"}],"text":"Active"},"category":[{"coding":[{"system":"https://stage.ema-api.com/ema-dev/firm/verbatimaisandbox/ema/fhir/v2/ValueSet/condition-category","code":"CONDITION","display":"Condition"}],"text":"Condition"}],"code":{"coding":[{"system":"ICD10","code":"B36.0","display":"Tinea versicolor"}],"text":"Tinea versicolor"},"subject":{"reference":"https://stage.ema-api.com/ema-dev/firm/verbatimaisandbox/ema/fhir/v2/Patient/340576","display":"https://stage.ema-api.com/ema-dev/firm/verbatimaisandbox/ema/fhir/v2/Patient/340576"},"onsetDateTime":"2024-02-14T10:21:14+00:00","recordedDate":"2024-02-14T15:21:14+00:00"};
  const medications = [{"resourceType":"MedicationStatement","status":"active","medicationCodeableConcept":{"coding":[{"system":"RxNorm","code":"106336","display":"Ketoconazole"}],"text":"Ketoconazole"},"subject":{"reference":"https://stage.ema-api.com/ema-dev/firm/verbatimaisandbox/ema/fhir/v2/Patient/340576","display":"https://stage.ema-api.com/ema-dev/firm/verbatimaisandbox/ema/fhir/v2/Patient/340576"},"dosage":[{"route":{"coding":[{"system":"FDARouteOfAdministration","code":"C38304","display":"TOPICAL"}],"text":"TOPICAL"}}]}];
  const username = 'dcane';
  const password = 'Password1234';
  const visitId = 301506;
  const providerUrl = 'https://verbatimaisandbox.m2integrationtest.com';
  const loginCookies = await login(username, password, providerUrl);
  expect(loginCookies.gdpr).toBeTruthy();
  expect(loginCookies.csid).toBeTruthy();
  expect(loginCookies.jsessionid).toBeTruthy();
  const diagnosisResult = await createDiagnosisFromCondition(condition, visitId, providerUrl, loginCookies, medications);
  expect(diagnosisResult.id).toBeTruthy();
  expect(diagnosisResult.procedures.length).toEqual(3);
}, 20000);

/*
test('Creates diagnosis from found value', async () => {
  const username = 'dcane';
  const password = 'Password1234';
  const visitId = 298750;
  const providerUrl = 'https://verbatimaisandbox.m2integrationtest.com';    
  const loginCookies = await login(username, password, providerUrl);
  expect(loginCookies.gdpr).toBeTruthy();
  expect(loginCookies.csid).toBeTruthy();
  expect(loginCookies.jsessionid).toBeTruthy();

  const condition: Condition = {"resourceType":"Condition","clinicalStatus":{"coding":[{"system":"http://hl7.org/fhir/ValueSet/condition-clinical","code":"ACTIVE","display":"Active"}],"text":"Active"},"category":[{"coding":[{"system":"https://stage.ema-api.com/ema-dev/firm/verbatimaisandbox/ema/fhir/v2/ValueSet/condition-category","code":"CONDITION","display":"Condition"}],"text":"Condition"}],"code":{"coding":[{"system":"ICD10","code":" L21","display":" Seborrheic Dermatitis"}],"text":" Seborrheic Dermatitis"},"subject":{"reference":"https://stage.ema-api.com/ema-dev/firm/verbatimaisandbox/ema/fhir/v2/Patient/340953","display":"https://stage.ema-api.com/ema-dev/firm/verbatimaisandbox/ema/fhir/v2/Patient/340953"},"onsetDateTime":"2024-02-14T10:21:14+00:00","recordedDate":"2024-02-14T15:21:14+00:00"};
  const diagnosisResult = await findDiagnosisByICDCode(condition, visitId, providerUrl, loginCookies);
  expect(diagnosisResult.diagnosisName).toEqual('Seborrheic Dermatitis');
  const diagnosisRequest: DiagnosisRequest = {
    visit: {
      id: visitId
    },
    diagnosisName: diagnosisResult.diagnosisName,
    diagnosis: diagnosisResult,
    diagnosisBodyLocations: [],
    procedures: [
      {
        procedure: 'Prescription',
        veProcedure: PRESCRIPTION_PLAN,
        procedureBodyLocations: []
      }
    ]
  };
  const diagnosisVisitResult = await sendDiagnosisRequest(providerUrl, loginCookies, diagnosisRequest);
  expect(diagnosisVisitResult.diagnosisName).toEqual('Seborrheic Dermatitis');
}, 20000);
*/