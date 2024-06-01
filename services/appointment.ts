import { buildModMedRequest } from "../helpers/modmed";

import axios, { AxiosRequestConfig } from 'axios';
export type AppointmentResponse = {
    entry: Array<AppointmentResource>;
};
export type AppointmentResource = {
    resource: Appointment;
};
export type Appointment = {
    start: string;
    end: string;
    status: string;
    participant:Array<Participant>;
};
export type Participant = {
    actor: Actor;
};
export type Actor = {
    reference: string;
    display: string;
    name?: string;
};
export const getAppointments = async (
    firmId: string, 
    accessToken: string
): Promise<AppointmentResponse> => {
    const result = await axios.request(
        buildModMedRequest(`/Appointment`, 'GET', firmId, accessToken)
    );
    console.log(result.data);
    return result.data;
}