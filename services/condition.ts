import { buildModMedRequest } from "../helpers/modmed";

import axios from 'axios';
import { ConditionalFormattingIconDisplayOption } from "aws-sdk/clients/quicksight";
import { postMessageToSlackChannel } from "./slack";
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
    condition: Condition,
    firmId: string, 
    accessToken: string
): Promise<Condition> => {
    const result = await axios.request({
        ...buildModMedRequest(`/Condition`, 'POST', firmId, accessToken),
        data: condition,
        validateStatus: (status) => {
          return status < 500;
        }
    }
    );
    await postMessageToSlackChannel('Modmed response for condition', {data: result.data } );
    console.log(result.data);
    return result.data;
}