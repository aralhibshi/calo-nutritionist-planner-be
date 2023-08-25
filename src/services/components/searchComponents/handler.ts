import Joi from 'joi';
import { IComponentSearchEvent } from '@lib/interfaces';
import { middyfy } from '@lib/middleware/eventParserMiddleware';
import { queryValidationMiddleware } from '@lib/middleware/validationMiddleware';
import { readExceptionHandlerMiddleware } from '@lib/middleware/exceptionHandlerMiddleware';
import { searchComponents } from './useCase';

export default middyfy(async (
  event: IComponentSearchEvent
): Promise<any> => {
  console.log('Received CloudFormation Event:', JSON.stringify(event, null, 2));

  const validationSchema = Joi.object({
    name: Joi
      .string()
      .min(1)
      .required()
  })

  // Validation before Processing
  await queryValidationMiddleware(validationSchema)(event)

  // useCase - Search Components
  const result = await searchComponents(event);
  return result;
})
.use(readExceptionHandlerMiddleware());