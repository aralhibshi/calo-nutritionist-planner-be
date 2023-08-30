import Joi from 'joi';
import { IComponentGetEvent } from '@lib/interfaces';
import { middyfy } from '@lib/middleware/eventParserMiddleware';
import { queryValidationMiddleware } from '@lib/middleware/validationMiddleware';
import { readExceptionHandlerMiddleware } from '@lib/middleware/exceptionHandlerMiddleware';
import { getComponents } from './useCase';

export default middyfy(async (
  event: IComponentGetEvent
): Promise<any> => {
  console.log('Received CloudFormation Event:', JSON.stringify(event, null, 2));

  const validationSchema = Joi.object({
    skip: Joi
      .number()
      .min(0)
      .required()
  })

  // Validation before Processing
  await queryValidationMiddleware(validationSchema)(event)

  // UseCase - Get Components
  const result = await getComponents(event);
  return result;
})
.use(readExceptionHandlerMiddleware());