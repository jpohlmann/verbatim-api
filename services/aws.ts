import { S3 } from 'aws-sdk';
const UPLOAD_BUCKET = 'verbatimai-upload';
const EXPIRE_SECONDS = 60 * 60;

export const getSignedUrl = async (key: string): Promise<string> => {
    const s3 = new S3();
    const url = await s3.getSignedUrl('putObject', {
        Bucket: UPLOAD_BUCKET,
        Key: key,
        Expires: EXPIRE_SECONDS,
        ContentType: 'audio/m4a'
    });
    return url;
}

export const deleteAssets = async (uuid: string): Promise<void> => {
    const s3 = new S3();
    s3.deleteObject({
        Bucket: UPLOAD_BUCKET,
        Key: `recordings/${uuid}.m4a`
    });
    s3.deleteObject({
        Bucket: UPLOAD_BUCKET,
        Key: `transcriptions/${uuid}.json`
    });
}