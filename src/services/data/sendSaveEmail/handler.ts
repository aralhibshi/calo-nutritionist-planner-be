import Joi from 'joi';
import { bodyValidationMiddleware } from '@lib/middleware/validationMiddleware';
import { sendEmail } from './useCase';

export default async (event) => {
  const validationSchema = Joi.object({
    Records: Joi
      .required()
  })
  
  // Validation Before Processing
  await bodyValidationMiddleware(validationSchema)(event)
  console.log(event)

  if (event.hasOwnProperty('Records') && Array.isArray(event.Records)) {
    for (const record of event.Records) {
      if (record.eventSource === 'aws:ses') {
        const sesEvent = JSON.parse(record.body);

        // Process SES event based on its type or content
        switch (sesEvent.notificationType) {
          case 'Bounce':
            // Handle bounce event
            console.log('Bounce event:', sesEvent);
            break;

          case 'Complaint':
            // Handle complaint event
            console.log('Complaint event:', sesEvent);
            break;

          default:
            console.log('Unknown SES event type:', sesEvent.notificationType);
            break;
        }
      } else if (record.eventSource === 'aws:sqs') {

        const { entity, user_email, email_type, url } = JSON.parse(event.Records[0].body);

        // Send Email
        await sendEmail(entity, user_email, email_type, url);
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
    }
  }
} 