import Joi from 'joi';
import { IIngredientDeleteEvent } from '@lib/interfaces';
import { middyfy } from '@lib/middleware/eventParserMiddleware';
import { queryValidationMiddleware } from '@lib/middleware/validationMiddleware';
import { deleteExceptionHandlerMiddleware } from '@lib/middleware/exceptionHandlerMiddleware';
import { removeIngredientFromComponentIngredient, deleteIngredient } from './useCase';

export default middyfy(async (
  event: IIngredientDeleteEvent
): Promise<any> => {
  console.log('Received CloudFormation Event:', JSON.stringify(event, null, 2));

  const validationSchema = Joi.object({
    id: Joi
      .string()
      .min(36)
      .required(),
  });

  // Validation before Processing
  await queryValidationMiddleware(validationSchema)(event);

  const { ...data } = event.queryStringParameters

  // useCase - Remove Ingredient from Component Ingredient
  await removeIngredientFromComponentIngredient(data)
 
  // useCase - Delete Ingredient
  const result = await deleteIngredient(data);

  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-control-Allow-Methods':'DELETE',
    },
    statusCode: 200,
    body: JSON.stringify({
      success: {
        title: 'Success',
        message: 'Ingredient deleted successfully',
      },
      data: result
    })
  };
})
.use(deleteExceptionHandlerMiddleware());