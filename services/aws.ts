import AWS from 'aws-sdk';
const UPLOAD_BUCKET = 'verbatimai-upload';
const EXPIRE_SECONDS = 60 * 5;

export const getSignedUrl = async (key: string): Promise<string> => {
    const s3 = new AWS.S3();
    const url = await s3.getSignedUrl('putObject', {
        Bucket: UPLOAD_BUCKET,
        Key: key,
        Expires: EXPIRE_SECONDS
    });
    return url;
}