import Joi from 'joi';
import { IComponentIngredientData, IComponentUpdateEvent } from '@lib/interfaces';
import { middyfy } from '@lib/middleware/eventParserMiddleware';
import { queryValidationMiddleware } from '@lib/middleware/validationMiddleware';
import { bodyValidationMiddleware } from '@lib/middleware/validationMiddleware';
import { updateExceptionHandlerMiddleware } from '@lib/middleware/exceptionHandlerMiddleware';
import { updateComponent, updateComponentInComponentIngredient } from './useCase';

export default middyfy(async (
  event: IComponentUpdateEvent 
): Promise<any> => {
  console.log('Received CloudFormation Event:', JSON.stringify(event, null, 2));

  const queryValidationSchema = Joi.object({
    id: Joi
      .string()
      .min(36)
      .required(),
  })
  const bodyValidationSchema = Joi.object({
    ingredients: Joi
      .array()
      .min(1)
      .required(),
    name: Joi
      .string()
      .min(3)
      .required(),
    category: Joi
      .string(),
    description: Joi
      .string(),
    unit: Joi
      .string()
      .min(1)
      .max(2)
      .valid('g', 'ml')
      .required()
  })

  // Validation before Processing
  await queryValidationMiddleware(queryValidationSchema)(event);
  await bodyValidationMiddleware(bodyValidationSchema)(event);

  const data = {
    ...event.body,
    ...event.queryStringParameters
  }

  // useCase - Update Ingredient
  await updateComponentInComponentIngredient(data,event.body.ingredients)
  // await updateComponentInMealComponent(data)
  const result = await updateComponent(data);

  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-control-Allow-Methods':'PUT',
    },
    statusCode: 200,
    body: JSON.stringify({
      success: {
        title: 'Success',
        message: 'Component updated successfully',
      },
      data: result,
    })
  };
})
.use(updateExceptionHandlerMiddleware());