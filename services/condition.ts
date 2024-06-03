import { buildModMedRequest } from "../helpers/modmed";

import axios from 'axios';
import { ConditionalFormattingIconDisplayOption } from "aws-sdk/clients/quicksight";
export type ClinicalStatusCoding = {
    system: string;
    code: string;
    display: string;
  }
  
  export type ClinicalStatus = {
    coding: ClinicalStatusCoding[];
    text: string;
  }
  
  export type CategoryCoding = {
    system: string;
    code: string;
    display: string;
  }
  
  export type Category = {
    coding: CategoryCoding[];
    text: string;
  }
  
  export type CodeCoding = {
    system: string;
    code: string;
    display: string;
  }
  
  export type Code = {
    coding: CodeCoding[];
    text: string;
  }
  
  export type Subject = {
    reference: string;
    display: string;
  }
  
  export type Condition = {
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