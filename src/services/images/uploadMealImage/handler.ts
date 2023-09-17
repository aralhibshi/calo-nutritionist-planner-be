import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { middyfy } from "@lib/middleware/eventParserMiddleware";
import dotenv from "dotenv";
dotenv.config();

const s3Client = new S3Client({ region: "us-east-1" });

export default middyfy(async (event) => {
  try {
    const { mealId} = event.body; // Assuming the mealId is sent from the frontend

    // Generate a unique filename for the meal image
    const fileName = `uploads/${mealId}.jpeg`;
    // folder => meal-uploads

    
    // Create a PutObjectCommand to specify the S3 upload
    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: fileName,
      ContentType: "image/jpeg", // Adjust the content type as needed
      Metadata: {
        "meal-name": event.body.mealName, // Add the meal name metadata
      },
    });

    // Generate the pre-signed URL for the PutObjectCommand
    const url = await getSignedUrl(s3Client, uploadCommand, {
      expiresIn: 600, // URL expires in 10 minutes
    });

    return {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
      },
      statusCode: 200,
      body: JSON.stringify({
        message: "Pre-signed URL for meal image upload generated",
        uploadUrl: url,
        fileName: fileName, // Send the generated filename back to the frontend
      }),
    };
  } catch (error) {
    return {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
      },
      statusCode: 500,
      body: JSON.stringify({
        error: {
          title: "ServerError",
          message: "An error occurred while generating the pre-signed URL",
          error,
        },
      }),
    };
  }
});