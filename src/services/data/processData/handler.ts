import Joi from 'joi';
import { queryValidationMiddleware } from '@lib/middleware/validationMiddleware';
import { createUrls, fetchData, putObject } from './useCase';

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

    // Create Put and Get URLs
    const urls = await createUrls(entity, user_id);

    // Get Entity Data
    const response: any = await fetchData(entity, skip, Number(take));

    // Create Object in S3 Bucket
    await putObject(urls?.putUrl!, response.data[entity]);

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
        url: urls?.getUrl!
      })
    };
  } catch (err) {
    console.log('Error while processing data', err)
  }
}