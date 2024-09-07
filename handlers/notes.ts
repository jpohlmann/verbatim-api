import { S3ObjectCreatedNotificationEvent, S3Handler } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import { extractUUID, getConditionFromStructuredNotes, getMedicationFromStructuredNotes, StructuredNotes } from '../helpers/modmed';
import { deleteAssets } from '../services/aws';
import { createCondition } from '../services/condition';
import { deleteDataByUuid, getDataByUuid } from '../services/dynamo';
import { createMedication } from '../services/medication';
import { postMessageToSlackChannel } from '../services/slack';

const s3 = new S3();

export const handler = async (event: S3ObjectCreatedNotificationEvent, context): Promise<any> => {
  try {
    console.log('Received S3 Put event:', JSON.stringify(event, null, 2));
    // Extract bucket name and key from the event
    const bucketName = event.detail.bucket.name;
    const objectKey = decodeURIComponent(event.detail.object.key.replace(/\+/g, ' '));

    // Retrieve the contents of the file from S3
    const getObjectParams = {
      Bucket: bucketName,
      Key: objectKey
    };
    const s3Object = await s3.getObject(getObjectParams).promise();

    // Decode the contents from JSON into an object
    const fileContents: StructuredNotes = JSON.parse(s3Object.Body.toString());
    const uuid = extractUUID(event.detail.object.key);
    const uuidObj = await getDataByUuid(uuid);
    if (!uuid || !uuidObj) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Could not find record' })
          };      
    }
    console.log('Transcribed File Data', JSON.stringify(fileContents));
    await postMessageToSlackChannel('Transcribed File Data', fileContents);
    const medications = getMedicationFromStructuredNotes(
        fileContents['Structured Notes'], 
        uuidObj.firm_id.S, 
        parseInt(uuidObj.patient_id.S)
    );
    const conditions = getConditionFromStructuredNotes(
        fileContents['Structured Notes'], 
        uuidObj.firm_id.S, 
        parseInt(uuidObj.patient_id.S)
    );
    for (let x = 0; x < medications.length; x++) {
      if (process.env.PRODUCTION_MODE !== 'true') {
        await postMessageToSlackChannel('Medication to Create', medications[x]);
      }
      console.log('creating medication', JSON.stringify(medications[x]));
      try {
        await createMedication(medications[x], uuidObj.firm_id.S, uuidObj.access_token.S);
      } catch (e) {
        await postMessageToSlackChannel('Modmed 500 error for medication', {name: medications[x].medicationCodeableConcept.text});
      }
    }
    for (let x = 0; x < conditions.length; x++) {
      if (process.env.PRODUCTION_MODE !== 'true') { 
        await postMessageToSlackChannel('Creating Conditions', conditions[x]);
      }
      console.log('creating conditions', JSON.stringify(conditions[x]));
      try {
        await createCondition(conditions[x], uuidObj.firm_id.S, uuidObj.access_token.S);
      } catch (e) {
        await postMessageToSlackChannel('Modmed 500 error for condition', {name: conditions[x].code});
      }
    }
    // If production, clear out assets after inserting into modmed
    if (process.env.PRODUCTION_MODE === 'true') {
      await deleteAssets(uuid);
      await deleteDataByUuid(uuid);
    }
    return {
        statusCode: 200,
        body: JSON.stringify({ 
            conditionsCreated: conditions.map(condition => condition.code),
            medicationsCreated: medications.map(medication => medication.medicationCodeableConcept.text)
         })
      };
} catch (error) {
    console.error('Error processing S3 Put event:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' })
    };
  }
};