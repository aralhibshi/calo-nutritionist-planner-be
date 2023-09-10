import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { middyfy } from "../../../libs/middleware/eventParserMiddleware";
import { v4 as uuid } from "uuid";

const s3Client = new S3Client({
  region: 'us-east-1'
});

export default middyfy(async (event) => {
  try {
    // Minimal Validation
    const requiredKeys = ['email', 'mealImage'];

    if (requiredKeys.every(key => event.body[key] !== undefined)) {
      const { email, mealImage } = event.body;
      const imageData = mealImage
      const bucketName = 'upload-image-dev-meal-image-bucket'
      const fileContent = Buffer.from(imageData, 'base64');
      const filePath = `${email}/` + uuid() + '-' + email + '-' + 'profile.jpeg';

      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: filePath,
        Body: fileContent,
        ContentType: 'image/jpeg'
      });

      await s3Client.send(command);

      return {
        statusCode: 201,
        body: JSON.stringify({
          message: 'Meal Image uploaded'
        })
      };
    } else {
      return {
        statusCode: 422,
        body: JSON.stringify({
          error: {
            title: 'ValidationError',
            message: 'Required fields are missing in the request body'
          }
        })
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: {
          title: 'ServerError',
          message: 'An error occurred while uploading the profile picture',
          error
        }
      })
    };
  }
});