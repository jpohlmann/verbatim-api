import { DynamoDB } from 'aws-sdk';
import { DynamoDBClient, QueryCommand, DeleteItemCommand } from '@aws-sdk/client-dynamodb';
import { AuthCookies } from '../types/modmed-ui';

export type DBNotesItem = {
    firm_id: { S: string };
    id: { S: string };
    access_token: { S: string };
    patient_id: { S: string };
    appointment_id: { S: string };
    gdpr: {S: string};
    jsessionid: {S: string};
    csid: {S: string};
  };
export const writeUuidToTable = async (uuid: string, firmId: string, accessToken: string, patientId: string, appointmentId: string, authCookies: AuthCookies): Promise<void> => {
    const client = new DynamoDB({ region: "us-east-1" });
    var params = {
        TableName: process.env.DYNAMODB_TABLE_NAME,  
        Item: {
          id: {S: uuid},
          access_token: {S: accessToken},
          firm_id: {S: firmId},
          patient_id: {S: patientId},
          appointment_id: {S: appointmentId},
          gdpr: {S: authCookies.gdpr},
          jsessionid: {S: authCookies.jsessionid},
          csid: {S: authCookies.csid}
        },
      };
    await client.putItem(params).promise();
}

export const getDataByUuid = async (uuid: string): Promise<DBNotesItem> => {
    const command = new QueryCommand({
        TableName: process.env.DYNAMODB_TABLE_NAME,
        KeyConditionExpression: 'id = :pk',
        ExpressionAttributeValues: { ':pk': { S: uuid }},
    });
    let dynamoClient = new DynamoDBClient({ region: "us-east-1" });
    const result = await dynamoClient.send(command);
    
    return result.Items[0] as unknown as DBNotesItem;
}

export const deleteDataByUuid = async (uuid: string): Promise<void> => {
  const command = new DeleteItemCommand({
    TableName: "YOUR_TABLE_NAME",
    Key: {
      "pk": { S: uuid }  // Assuming the PK is a string. If it's a different type, change `S` to the appropriate type.
    }
  });
  let dynamoClient = new DynamoDBClient({ region: "us-east-1" });
  await dynamoClient.send(command);
}
/*
export const readTranscription = async (uuid: string): Promise<Transcription> => {
    const client = new DynamoDB({ region: "us-east-2" });
    const mapper = new DataMapper({ client });
    const object = await mapper.get(Object.assign(new Transcription, {id: uuid}))
    return object;
}*/