import Joi from 'joi';
import { bodyValidationMiddleware } from '@lib/middleware/validationMiddleware';
import { sendSaveEmail } from './useCase';

export default async (event) => {
  const validationSchema = Joi.object({
    Records: Joi
      .required()
  })
  
  // Validation Before Processing
  await bodyValidationMiddleware(validationSchema)(event)
  console.log("REQUEST RECEIVED:\n" + JSON.stringify(event));

  const { entity, user_email, email_type, url } = JSON.parse(event.Records[0].body);

  // Send Email Save Email
  const table = process.env.TABLE_NAME!
  await sendSaveEmail(entity, user_email, email_type, url, table);
  return {
    statusCode: 200,
    body: JSON.stringify({
      success: {
        title: 'Success',
        message: `SQS message received successfully`,
      }
    })
  };
}