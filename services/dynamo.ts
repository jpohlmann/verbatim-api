import { DynamoDB } from 'aws-sdk';
import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';

export type DBNotesItem = {
    id: string;
    access_token: string;
    firm_id: string;
    patient_id: string;
};
export const writeUuidToTable = async (uuid: string, firmId: string, accessToken: string, patientId: string): Promise<void> => {
    const client = new DynamoDB({ region: "us-east-1" });
    var params = {
        TableName: process.env.DYNAMODB_TABLE_NAME,  
        Item: {
          id: {S: uuid},
          access_token: {S: accessToken},
          firm_id: {S: firmId},
          patient_id: {S: patientId}
        },
      };
    const request = client.putItem(params)
    await request.send((err) => {
        console.log(err);
    });
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

/*
export const readTranscription = async (uuid: string): Promise<Transcription> => {
    const client = new DynamoDB({ region: "us-east-2" });
    const mapper = new DataMapper({ client });
    const object = await mapper.get(Object.assign(new Transcription, {id: uuid}))
    return object;
}*/