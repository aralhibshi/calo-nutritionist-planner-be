import fetch from 'node-fetch';
import https from "https";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export default async (event) => {
  try {
    const bucketName = process.env.BUCKET_NAME!;
    console.log('bucketName:', bucketName);

    const { entity, user_id } = event
    const objectKey = `${entity}/${user_id}-test.txt`;
    const putExpiresIn = 120;
    const getExpiresIn = 300;

    // Create Put Url
    const putUrl = await createPresignedPutUrlWithClient(bucketName, objectKey, putExpiresIn);

    // Create Get Url
    const getUrl = await createPresignedGetUrlWithClient(bucketName, objectKey, getExpiresIn);
    console.log(getUrl);

    // Get Entity Data
    const response: any = await fetchData(event.entity);

    // Create Object in S3 Bucket
    // await putObject(putUrl, JSON.stringify('hello this is a test'));
    // await putObject(putUrl, JSON.stringify(response?.data.data));
    await putObject(putUrl, JSON.stringify(response.data));
  } catch (err) {
    console.log('Error while processing data', err)
  }
}

// Presigned Put URL
async function createPresignedPutUrlWithClient (bucket: string, key: string, expires: number) {
  try {
    const client = new S3Client({
      region: 'us-east-1'
    });
  
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key
    });
  
    return await getSignedUrl(client, command, {expiresIn: expires});
  }
  catch (err) {
    console.log('Error creating pre-signed PUT Url', err);
  }
};

// Presigned Get URL
async function createPresignedGetUrlWithClient (bucket: string, key: string, expires: number) {
  try {
    const client = new S3Client({
      region: 'us-east-1'
    });
  
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key
    });
  
    return await getSignedUrl(client, command, {expiresIn: expires});
  }
  catch (err) {
    console.log('Error creating presigned GET Url', err);
  }
};

// Put Object
async function putObject(url, data) {
  try {
    return new Promise((resolve, reject) => {
      const contentLength = Buffer.byteLength(data, 'utf-8');
      const req = https.request(
        url,
        {
          method: "PUT",
          headers: {
            "Content-Length": contentLength
          }
        },
        (res) => {
          let responseBody = "";
          res.on("data", (chunk) => {
            responseBody += chunk;
          });
          res.on("end", () => {
            resolve(responseBody);
          });
        }
      );
      req.on("error", (err) => {
        reject(err);
      });
      req.write(data);
      req.end();
    });
  }
  catch (err) {
    console.log('Error putting object into bucket', err)
  }
}

// Fetch Entity Data
async function fetchData(entity: string) {
  try {
    const baseUrl = process.env.BASE_URL!;
    const url = baseUrl + entity + '?skip=0&take=10';

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  }
  catch (err) {
    console.log('Error fetching data', err)
  }
}