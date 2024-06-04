import { DataMapper } from '@aws/dynamodb-data-mapper';
import {
    attribute,
    hashKey,
    rangeKey,
    table,
} from '@aws/dynamodb-data-mapper-annotations';
import { DynamoDB } from 'aws-sdk';

export const writeUuidToTable = async (uuid: string, firmId: string, accessToken: string): Promise<void> => {
    const client = new DynamoDB({ region: "us-east-1" });
    var params = {
        TableName: process.env.DYNAMODB_TABLE_NAME,  
        Item: {
          id: {S: uuid},
          access_token: {S: accessToken},
          firm_id: {S: firmId}
        },
      };
    const request = client.putItem(params)
    await request.send((err) => {
        console.log(err);
    });
}
/*
export const readTranscription = async (uuid: string): Promise<Transcription> => {
    const client = new DynamoDB({ region: "us-east-2" });
    const mapper = new DataMapper({ client });
    const object = await mapper.get(Object.assign(new Transcription, {id: uuid}))
    return object;
}*/