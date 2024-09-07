import { login, sendDiagnosisRequest } from "./modmed-form";
import { DiagnosisRequest } from "../types/modmed-ui";
import {expect, test} from '@jest/globals';

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
            procedure: 'ASC Consultation',
            veProcedure: {
              name: 'ASC Consultation',
              id: 14280,
              labelColor: 'white',
              labelText: 'consultation',
              labelVisible: true,
              pathologyReq: false,
              procedureAlias: 'ConsultationSurgeryASC',
              requiresBodyLocation: false
            },
            procedureBodyLocations: []
          }
        ]
      };
      const diagnosisResult = await sendDiagnosisRequest(providerUrl, loginCookies, diagnosisRequest);
      expect(diagnosisResult.diagnosisName).toEqual('Warts');
});
