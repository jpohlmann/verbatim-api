import { APIGatewayProxyEvent } from 'aws-lambda';
import { getAppointments } from '../services/appointment';
export const handler = async (event: APIGatewayProxyEvent) => {
    if (!event.headers?.authorization) {
      return {
        statusCode: 400,
        body: 'Bad Request, missing auth header'
      }
    }
    const { firm_id } = event.queryStringParameters;
    const authArray = event.headers?.authorization.split(' ');
    if (!firm_id || !authArray[1]) {
      return {
        statusCode: 400,
        body: 'Bad Request, missing params'
      }
    }
    try {
      const appointments = await getAppointments(firm_id, authArray[1]);
      if (appointments) {
        return {
          statusCode: 200,
          body: JSON.stringify(
            appointments
          ),
        };
      }
      return {
        statusCode: 404,
        body: JSON.stringify(
          {message: "Appointments not found"}
        ),
      };
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