import Joi from 'joi';
import { queryValidationMiddleware } from '@lib/middleware/validationMiddleware';
import { createPresignedPutUrlWithClient, createPresignedGetUrlWithClient, fetchData, putObject } from './useCase';
import { jsonToCsv } from 'src/utils/conversionUtils';

export default async (event) => {
  try {
    const validationSchema = Joi.object({
      entity: Joi
        .string()
        .min(5)
        .max(11)
        .required(),
      user_id: Joi
        .string()
        .required(),
      skip: Joi
        .number()
        .min(0)
        .max(500)
        .required(),
      take: Joi
        .number()
        .min(4)
        .max(500)
        .required()
    })

    // Validation befor Processing
    await queryValidationMiddleware(validationSchema)(event)

    const { entity, user_id, skip, take } = event.queryStringParameters
    const bucketName = process.env.BUCKET_NAME!;
    const objectKey = `${entity}/${user_id}.csv`;

    // Create Put Url
    const putUrl = await createPresignedPutUrlWithClient(bucketName, objectKey);

    // Create Get Url
    const getUrl = await createPresignedGetUrlWithClient(bucketName, objectKey, entity);

    // Get Entity Data
    const response: any = await fetchData(entity, skip, Number(take));

    // Convert JSON to CSV
    const data = jsonToCsv(response.data[entity])

    // Create Object in S3 Bucket
    await putObject(putUrl, data);

    return {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-control-Allow-Methods':'GET',
      },
      statusCode: 200,
      body: JSON.stringify({
        success: {
          title: 'Success',
          message: `${entity} exported successfully`,
        },
        url: getUrl
      })
    };
  } catch (err) {
    console.log('Error while processing data', err)
  }
}