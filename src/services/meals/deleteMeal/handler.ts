import Joi from 'joi';
import { middyfy } from '@lib/middleware/eventParserMiddleware';
import { queryValidationMiddleware } from '@lib/middleware/validationMiddleware';
import { deleteExceptionHandlerMiddleware } from '@lib/middleware/exceptionHandlerMiddleware';
import { removeMealFomMealComponent, deleteMeal } from './useCase';

export default middyfy(async (event) => {
  console.log('Received CloudFormation Event:', JSON.stringify(event, null, 2));

  const validationSchema = Joi.object({
    id: Joi
      .string()
      .min(36)
      .required()
  })

  // Validation before Processing
  await queryValidationMiddleware(validationSchema)(event);

  // useCase - Remove Meal from MealComponent
  await removeMealFomMealComponent(event);

  // useCase - Delete Ingredient
  const result = await deleteMeal(event);
  return result;
})
.use(deleteExceptionHandlerMiddleware());