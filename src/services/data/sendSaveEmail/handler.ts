import Joi from 'joi';
import { bodyValidationMiddleware } from '@lib/middleware/validationMiddleware';

export default async (event) => {
  try {
    const validationSchema = Joi.object({
      Records: Joi
        .required()
    })

    // Validation Before Processing
    await bodyValidationMiddleware(validationSchema)(event)

    const sqsMessage = event.Records[0].body;
    console.log(sqsMessage)

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: {
          title: 'Success',
          message: `SQS message received successfully`,
        },
        message: sqsMessage
      })
    };
  } catch (err) {
    console.error('Error occurred while processing SQS message:', err);
    return {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-control-Allow-Methods':'GET',
      },
      statusCode: 500,
      body: JSON.stringify({
        success: {
          title: 'Error',
          message: `Error occurred while processing SQS message:`,
        },
        details: err
      })
    };
  }
};