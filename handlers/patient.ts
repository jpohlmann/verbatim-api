import { APIGatewayProxyEvent } from 'aws-lambda';
import { getPatient } from '../services/patient';
export const handler = async (event: APIGatewayProxyEvent) => {
    if (!event.headers?.authorization) {
      return {
        statusCode: 400,
        body: 'Bad Request, missing auth header'
      }
    }
    const {patient_id, firm_id } = event.queryStringParameters;
    const authArray = event.headers?.authorization.split(' ');
    if (!patient_id || !firm_id || !authArray[1]) {
      return {
        statusCode: 400,
        body: 'Bad Request, missing params'
      }
    }
    try {
      const patient = await getPatient(parseInt(patient_id), firm_id, authArray[1]);
      if (patient) {
        return {
          statusCode: 200,
          body: JSON.stringify(
            patient
          ),
        };
      }
      return {
        statusCode: 404,
        body: JSON.stringify(
          {message: "Patient not found"}
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