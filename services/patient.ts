import axios from 'axios';
import { buildModMedRequest } from '../helpers/modmed';
export type PatientResponse = {
    id: string,
    resourceType: string;
};

export const getPatient = async (
    patientId: number, 
    firmId: string, 
    accessToken: string
): Promise<PatientResponse> => {
    const result = await axios.request(
        buildModMedRequest(`/Patient/${patientId}`, 'GET', firmId, accessToken)
    );
    console.log(result.data);
    return result.data;
}