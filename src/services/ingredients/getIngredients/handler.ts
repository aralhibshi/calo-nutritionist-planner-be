import Joi from 'joi';
import { IIngredientGetEvent } from '@lib/interfaces';
import { middyfy } from '@lib/middleware/eventParserMiddleware';
import { queryValidationMiddleware } from '@lib/middleware/validationMiddleware';
import { readExceptionHandlerMiddleware } from '@lib/middleware/exceptionHandlerMiddleware';
import { getIngredients } from './useCase';

export default middyfy(async (
  event: IIngredientGetEvent
): Promise<any> => {
  console.log('Received CloudFormation Event:', JSON.stringify(event, null, 2));

  const validationSchema = Joi.object({
    skip: Joi
      .number()
      .min(15)
      .max(15)
      .required()
  })

  // Validation befor Processing
  await queryValidationMiddleware(validationSchema)(event)

  // useCase - Get Ingredients
  const result = await getIngredients(event);
  return result;
})
.use(readExceptionHandlerMiddleware());