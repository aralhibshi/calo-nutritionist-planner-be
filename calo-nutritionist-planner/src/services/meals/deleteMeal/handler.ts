import Joi from 'joi';
import { IMealDeleteEvent } from 'calo-nutritionist-planner/src/libs/interfaces';
import { middyfy } from 'libs/middleware/eventParserMiddleware';
import { queryValidationMiddleware } from 'libs/middleware/validationMiddleware';
import { deleteExceptionHandlerMiddleware } from 'libs/middleware/exceptionHandlerMiddleware';
import { removeMealFomMealComponent, deleteMeal } from './useCase';

export default middyfy(async (
  event: IMealDeleteEvent
): Promise<any> => {
  console.log('Received CloudFormation Event:', JSON.stringify(event, null, 2));

  const validationSchema = Joi.object({
    id: Joi
      .string()
      .min(36)
      .required()
  })

  // Validation before Processing
  await queryValidationMiddleware(validationSchema)(event);

  const { ...data } = event.queryStringParameters

  // useCase - Remove Meal from MealComponent
  await removeMealFomMealComponent(data);

  // useCase - Delete Ingredient
  const result = await deleteMeal(data);

  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-control-Allow-Methods':'DELETE',
    },
    statusCode: 200,
    body: JSON.stringify({
      success: {
        title: 'Success',
        message: 'Meal deleted successfully',
      },
      data: result
    })
  };
})
.use(deleteExceptionHandlerMiddleware());