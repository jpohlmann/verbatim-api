import parseMultipart from 'parse-multipart';

export const extractFile = (event) => {
    const boundary = parseMultipart.getBoundary(event.headers['content-type'])
    const parts = parseMultipart.Parse(Buffer.from(event.body, 'base64'), boundary);
    const [{ filename, data }] = parts
   
    return {
      filename,
      data
    }
  }