import Joi from 'joi';
import { IIngredientSearchEvent } from '@lib/interfaces';
import { middyfy } from '@lib/middleware/eventParserMiddleware';
import { queryValidationMiddleware } from '@lib/middleware/validationMiddleware';
import { readExceptionHandlerMiddleware } from '@lib/middleware/exceptionHandlerMiddleware';
import { searchIngredients } from './useCase';

export default middyfy(async (
  event: IIngredientSearchEvent
): Promise<any> => {
  console.log('Received CloudFormation Event:', JSON.stringify(event, null, 2));

  const validationSchema = Joi.object({
    name: Joi
      .string()
      .required(),
    skip: Joi
      .number()
      .min(0)
      .required()
  })

  // Validation before Processing
  await queryValidationMiddleware(validationSchema)(event);

  // useCase - Search Ingredients
  const result = await searchIngredients(event);
  return result;
})
.use(readExceptionHandlerMiddleware());