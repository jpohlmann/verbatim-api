import axios, { AxiosRequestConfig } from 'axios';
import * as env from 'env-var';

export type LoginResponse = {
    scope: string,
    token_type: string,
    access_token: string,
    refresh_token: string
};

export const login = async (
    firmId: string, 
    username: string, 
    password: string
): Promise<LoginResponse> => {
    const result = await axios.request(
        {
            url: `https://${env.get('DOMAIN_URL').asString()}/ema-dev/firm/${firmId}/ema/ws/oauth2/grant`,
            method: 'POST',
            headers: {
                'x-api-key': env.get('X_API_KEY').required().asString(),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: {
                grant_type: 'password',
                username,
                password
            }
        }
    );
    return result.data;
}

export const refresh = async (
    firmId: string, 
    refreshToken: string
): Promise<LoginResponse> => {
    const result = await axios.request(
        {
            url: `https://${env.get('DOMAIN_URL').asString()}/ema-dev/firm/${firmId}/ema/ws/oauth2/grant`,
            method: 'POST',
            headers: {
                'x-api-key': env.get('X_API_KEY').required().asString(),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: {
                grant_type: 'refresh_token',
                refreshToken
            }
        }
    );
    console.log(result.data);
    return result.data;
}