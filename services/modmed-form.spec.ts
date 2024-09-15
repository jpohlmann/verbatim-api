import { findDiagnosisByICDCode, login, PRESCRIPTION_PLAN, sendDiagnosisRequest } from "./modmed-form";
import { DiagnosisRequest } from "../types/modmed-ui";
import {expect, test} from '@jest/globals';
import { Condition } from "./condition";

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