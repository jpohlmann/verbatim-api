import { buildModMedRequest } from "../helpers/modmed";

import axios, { AxiosRequestConfig } from 'axios';
interface MedicationCoding {
    system: string;
    code: string;
    display: string;
  }
  
  interface MedicationCodeableConcept {
    coding: MedicationCoding[];
    text: string;
  }
  
  interface Subject {
    reference: string;
    display: string;
  }
  
  interface RouteCoding {
    system: string;
    code: string;
    display: string;
  }
  
  interface Route {
    coding: RouteCoding[];
    text: string;
  }
  
  interface Dosage {
    route: Route;
  }
  
  interface MedicationStatement {
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
        data: medicationStatement
    }
    );
    console.log(result.data);
    return result.data;
}