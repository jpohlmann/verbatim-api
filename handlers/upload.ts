import { getPatient } from '../services/patient';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { getSignedUrl } from '../services/aws';
import { randomUUID } from 'crypto';
import { writeUuidToTable } from '../services/dynamo';
export const handler = async (event: APIGatewayProxyEvent) => {
  if (!event.body || !event.headers?.authorization) {
    return {
      statusCode: 400,
      body: 'Bad Request, missing request body'
    }
  }
  const {firm_id, patient_id } = JSON.parse(event.body);
  const authArray = event.headers?.authorization.split(' ');
  if (!authArray[1] || !firm_id || !patient_id) {
    return {
      statusCode: 400,
      body: 'Bad Request, missing params'
    }
  }
  try {
    const patient = await getPatient(patient_id, firm_id, authArray[1]);

    if (patient) {
      const uuid = randomUUID();
      console.log({uuid, firm_id, access: authArray[1]});
      await writeUuidToTable(uuid, firm_id, authArray[1]);
      const url = await getSignedUrl(`recordings/${uuid}.m4a`);
      return {
        statusCode: 201,
        body: JSON.stringify(
          {
            url
          }
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