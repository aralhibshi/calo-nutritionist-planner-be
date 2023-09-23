import Joi from 'joi';
import { middyfy } from '@lib/middleware/eventParserMiddleware';
import { queryValidationMiddleware } from '@lib/middleware/validationMiddleware';
import { createUrls, fetchData, putObject, sendMessageToSQS } from './useCase';
import { readExceptionHandlerMiddleware } from '@lib/middleware/exceptionHandlerMiddleware';

export default middyfy(async (
  event
) => {
  const validationSchema = Joi.object({
    entity: Joi
      .string()
      .min(5)
      .max(11)
      .required(),
    user_id: Joi
      .string()
      .required(),
    user_email: Joi
      .string()
      .required(),
    email_type: Joi
      .string()
      .valid('welcome', 'data-report')
      .required(),
    skip: Joi
      .number()
      .min(0)
      .max(500)
      .required(),
    // Alternative is to not require skip when welcoming a user, need to implement in serverless.yml
    // skip: Joi
    //   .number()
    //   .when('email_type', {
    //   is: 'data-report',
    //   then: Joi.number().min(0).max(500).required(),
    //   otherwise: Joi.number().forbidden()
    // }),
    take: Joi
      .number()
      .min(4)
      .max(500)
      .required()
    // Alternative is to not require take when welcoming a user, need to implement in serverless.yml
    // take: Joi
    //   .number()
    //   .when('email_type', {
    //   is: 'data-report',
    //   then: Joi.number().min(4).max(500).required(),
    //   otherwise: Joi.number().forbidden()
    // })
  })

  // Validation before Processing
  await queryValidationMiddleware(validationSchema)(event)

  const {
    entity,
    user_email,
    user_id,
    email_type,
    skip,
    take
  } = event.queryStringParameters

  if (email_type === 'welcome') {
    // Send Message to SQS
    await sendMessageToSQS(entity, user_email, email_type, '');

    return {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-control-Allow-Methods':'GET',
      },
      statusCode: 200,
      body: JSON.stringify({
        success: {
          title: 'Success',
          message: 'SQS Message Sent',
        },
      })
    };
  } else {
    // Create Put and Get URLs
    const urls = await createUrls(entity, user_id);

    // Get Entity Data
    const response: any = await fetchData(entity, skip, Number(take));

    // Create Object in S3 Bucket
    await putObject(urls?.putUrl!, response.data[entity]);

    // Send Message to SQS
    await sendMessageToSQS(entity, user_email, email_type, urls?.getUrl!);

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
        data: urls?.getUrl!
      })
    }
  }
})
.use(readExceptionHandlerMiddleware());