import { buildModMedRequest } from "../helpers/modmed";

import axios, { AxiosRequestConfig } from 'axios';
import { postMessageToSlackChannel } from "./slack";
export type MedicationCoding = {
    system: string;
    code: string;
    display: string;
  }
  
  export type MedicationCodeableConcept = {
    coding: MedicationCoding[];
    text: string;
  }
  
  export type Subject = {
    reference: string;
    display: string;
  }
  
  export type RouteCoding = {
    system: string;
    code: string;
    display: string;
  }
  
  export type Route = {
    coding: RouteCoding[];
    text: string;
  }
  
  export type Dosage = {
    route: Route;
  }
  
  export type MedicationStatement = {
    resourceType: string;
    status: string;
    medicationCodeableConcept: MedicationCodeableConcept;
    subject: Subject;
    dosage: Dosage[];
  }
export const createMedication = async (
    medicationStatement: MedicationStatement,
    firmId: string, 
    accessToken: string
): Promise<MedicationStatement> => {
    const result = await axios.request({
        ...buildModMedRequest(`/MedicationStatement`, 'POST', firmId, accessToken),
        data: medicationStatement,
        validateStatus: (status) => {
          return status < 500;
        }
    }
    );
    await postMessageToSlackChannel('Modmed response for medication', {data: result.data } );
    console.log(result.data);
    return result.data;
}