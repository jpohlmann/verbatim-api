import { S3ObjectCreatedNotificationEvent, S3Handler } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import { extractUUID, getConditionFromStructuredNotes, getMedicationFromStructuredNotes, StructuredNotes } from '../helpers/modmed';
import axios from 'axios';
const s3 = new S3();

export const handler = async (event: S3ObjectCreatedNotificationEvent, context): Promise<any> => {
  try {
    console.log('Received S3 Put event:', JSON.stringify(event, null, 2));
    // Extract key from the event
    const objectKey = decodeURIComponent(event.detail.object.key.replace(/\+/g, ' '));

    const uuid = extractUUID(event.detail.object.key);

    const result = await axios.post('http://172.31.65.247/transcribe', {
      audio_file_path: objectKey,
      uid: uuid
    },{
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return {
        statusCode: 200,
        body: JSON.stringify(result.data)
      };
} catch (error) {
    console.error('Error processing S3 Put event:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' })
    };
  }
};