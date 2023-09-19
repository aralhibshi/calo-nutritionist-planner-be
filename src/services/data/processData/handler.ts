import fetch from 'node-fetch';
import https from "https";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export default async (event) => {
  try {
    const bucketName = process.env.BUCKET_NAME!;
    console.log('bucketName:', bucketName);

    const objectKey = `${event.body.entity}/test.txt`;
    const expiresIn = 600;

    const putUrl = await createPresignedUrlWithClient(bucketName, objectKey, expiresIn);
    console.log(putUrl);

    await put(putUrl, "Hello World");
  } catch (err) {
    console.log('Error putting object', err)
  }
}

// Presigned Put URL
async function createPresignedUrlWithClient (bucket: string, key: string, expires: number) {
  const client = new S3Client({
    region: 'us-east-1'
  });

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key
  });

  return await getSignedUrl(client, command, {expiresIn: expires});
};

// Put Object
function put(url, data) {
  return new Promise((resolve, reject) => {
    const contentLength = Buffer.byteLength(data, 'utf-8');
    const req = https.request(
      url,
      {
        method: "PUT",
        headers: {
          // "Content-Length": new Blob([data]).size
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