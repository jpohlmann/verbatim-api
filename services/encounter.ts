import { string1To255 } from "aws-sdk/clients/customerprofiles";
import axios from "axios";
import { buildModMedRequest } from "../helpers/modmed";

type Bundle = {
    resourceType: string;
    id: string;
    meta: {
      lastUpdated: string;
    };
    type: string;
    total: number;
    link: Array<{
      relation: string;
      url: string;
    }>;
    entry: Array<{
      fullUrl: string;
      resource: Encounter;
    }>;
  };
  
  export type Encounter = {
    resourceType: string;
    id: string;
    meta: {
      lastUpdated: string;
    };
    status: string;
    class: {
      system: string;
      code: string;
      display: string;
    };
    type: Array<{
      coding: Array<{
        system: string;
        code: string;
        display: string;
      }>;
    }>;
    subject: {
      reference: string;
      display: string;
    };
    participant: Array<{
      type: Array<{
        coding: Array<{
          system: string;
          code: string;
          display: string;
        }>;
        text: string;
      }>;
      individual: {
        reference: string;
        display: string;
      };
    }>;
    appointment: Array<{
      reference: string;
      display: string;
    }>;
    period: {
      start: string;
    };
    diagnosis: Array<{
      condition: {
        identifier: {
          system: string;
          value: string;
        };
        display: string;
      };
    }>;
    location: Array<{
      location: {
        reference: string;
        display: string;
      };
    }>;
  };
export const getEncounterForAppointment = async (appointmentId: number, firmId: string, accessToken: string): Promise<Encounter> => {
    const requestData = buildModMedRequest(`/Encounter`, 'GET', firmId, accessToken);
    requestData.url += `?appointment=${appointmentId}`;    
    const result = await axios.request(requestData);
    console.log(result.data);
    return (result.data as Bundle).entry[0].resource;
}