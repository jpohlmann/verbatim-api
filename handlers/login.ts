import { APIGatewayProxyEvent } from 'aws-lambda';
import { login, LoginResponse, refresh } from '../services/auth';
import { AuthCookies } from '../types/modmed-ui';
import { login as sessionLogin } from '../services/modmed-form';

// TODO: need to figure out how the api user/password work from modmed.
// Possibly make this dynamic per practice?
const API_USER = 'fhir_VNxPW';
const API_PASSWORD = 'cfbAf5Vb0D';

type CredentialResponse = {
  apiLogin: LoginResponse;
  sessionLogin: AuthCookies;
}
export const handler = async (event: APIGatewayProxyEvent) => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: 'Bad Request, missing request body'
    }
  }
  const {username, password, firm_id } = JSON.parse(event.body);
  if (!username || !firm_id || !password) {
    return {
      statusCode: 400,
      body: 'Bad Request, missing params'
    }
  }
  try {
    const credentials = await login(firm_id, API_USER, API_PASSWORD);
    const sessionCookies = await sessionLogin(
      username, 
      password, 
      `https://${firm_id}.m2integrationtest.com/ema/provider-login`
    );
    if (credentials && sessionCookies) {
      const combinedCredentials: CredentialResponse = {
        apiLogin: credentials,
        sessionLogin: sessionCookies
      };
      return {
        statusCode: 201,
        body: JSON.stringify(combinedCredentials),
      };
    }
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify(
        {
          message: e.message
        }
      ),
    };
  }
};
export const refresh_request = async (event: APIGatewayProxyEvent) => {
    if (!event.body) {
      return {
        statusCode: 400,
        body: 'Bad Request, missing request body'
      }
    }
    const {refresh_token, firm_id } = JSON.parse(event.body);
    if (!refresh_token || !firm_id) {
      return {
        statusCode: 400,
        body: 'Bad Request, missing params'
      }
    }
    try {
      const credentials = await refresh(firm_id, refresh_token);
      if (credentials) {
        return {
          statusCode: 201,
          body: JSON.stringify(
            credentials
          ),
        };
      }
    } catch (e) {
      return {
        statusCode: 500,
        body: JSON.stringify(
          {
            message: e.message
          }
        ),
      };
    }
  };