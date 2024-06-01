import axios, { AxiosRequestConfig } from 'axios';
import * as env from 'env-var';

export const buildModMedRequest = (
    endpoint: string, 
    method: string, 
    firmId: string, 
    accessToken: string
) : AxiosRequestConfig => {
    return {
        url: `https://${env.get('DOMAIN_URL').asString()}/ema-dev/firm/${firmId}/ema/fhir/v2${endpoint}`,
        method,
        headers: {
            'x-api-key': env.get('X_API_KEY').required().asString(),
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
        }
    };
};