import { APIGatewayProxyEvent } from 'aws-lambda';
import { login, refresh } from '../services/auth';
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
    const credentials = await login(firm_id, username, password);
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