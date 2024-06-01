import { buildModMedRequest } from "../helpers/modmed";

import axios, { AxiosRequestConfig } from 'axios';
import { ConditionalFormattingIconDisplayOption } from "aws-sdk/clients/quicksight";
interface ClinicalStatusCoding {
    system: string;
    code: string;
    display: string;
  }
  
  interface ClinicalStatus {
    coding: ClinicalStatusCoding[];
    text: string;
  }
  
  interface CategoryCoding {
    system: string;
    code: string;
    display: string;
  }
  
  interface Category {
    coding: CategoryCoding[];
    text: string;
  }
  
  interface CodeCoding {
    system: string;
    code: string;
    display: string;
  }
  
  interface Code {
    coding: CodeCoding[];
    text: string;
  }
  
  interface Subject {
    reference: string;
    display: string;
  }
  
  interface Condition {
    resourceType: string;
    clinicalStatus: ClinicalStatus;
    category: Category[];
    code: Code;
    subject: Subject;
    onsetDateTime: string;
    recordedDate: string;
  }
export const createCondition = async (
    condition: ConditionalFormattingIconDisplayOption,
    firmId: string, 
    accessToken: string
): Promise<Condition> => {
    const result = await axios.request({
        ...buildModMedRequest(`/MedicationStatement`, 'POST', firmId, accessToken),
        data: condition
    }
    );
    console.log(result.data);
    return result.data;
}