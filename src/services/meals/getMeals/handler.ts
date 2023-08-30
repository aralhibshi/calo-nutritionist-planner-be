import Joi from 'joi';
import { IMealGetEvent } from '@lib/interfaces';
import { middyfy } from '@lib/middleware/eventParserMiddleware';
import { queryValidationMiddleware } from '@lib/middleware/validationMiddleware';
import { readExceptionHandlerMiddleware } from '@lib/middleware/exceptionHandlerMiddleware';
import { getMeals } from './useCase';

export default middyfy(async (
  event: IMealGetEvent
): Promise<any> => {
  console.log('Received CloudFormation Event:', JSON.stringify(event, null, 2));

  const validationSchema = Joi.object({
    skip: Joi
      .number()
      .min(0)
      .required(),
    take: Joi
      .number()
      .min(9)
      .max(500)
      .required()
  })

  // Validation before Processing
  await queryValidationMiddleware(validationSchema)(event);

  // useCase - Get Ingredients
  const result = await getMeals(event);
  return result;
})
.use(readExceptionHandlerMiddleware())