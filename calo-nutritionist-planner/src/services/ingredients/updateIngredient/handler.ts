import Joi from 'joi';
import { IIngredientUpdateEvent } from 'calo-nutritionist-planner/src/libs/interfaces';
import { middyfy } from 'libs/middleware/eventParserMiddleware';
import { queryValidationMiddleware } from 'libs/middleware/validationMiddleware';
import { bodyValidationMiddleware } from 'libs/middleware/validationMiddleware';
import { updateExceptionHandlerMiddleware } from 'libs/middleware/exceptionHandlerMiddleware';
import { updateIngredient } from './useCase';

export default middyfy(async (
  event: IIngredientUpdateEvent
): Promise<any> => {
  console.log('Received CloudFormation Event:', JSON.stringify(event, null, 2));

  const queryValidationSchema = Joi.object({
    id: Joi
      .string()
      .min(36)
      .max(36)
      .required(),
  })

  const bodyValidationSchema = Joi.object({
    name: Joi
      .string()
      .required(),
    category: Joi
      .string(),
    description: Joi
      .string(),
    price: Joi
      .number()
      .max(999.999)
      .required(),
    protein: Joi
      .number()
      .max(0.999)
      .required(),
    fats: Joi
      .number()
      .max(0.999)
      .required(),
    carbs: Joi
      .number()
      .max(0.999)
      .required(),
    unit: Joi
      .string()
      .max(2)
      .valid('g', 'ml')
      .required(),
  });

  // Validation before Processing
  await queryValidationMiddleware(queryValidationSchema)(event);
  await bodyValidationMiddleware(bodyValidationSchema)(event);

  const data = {
    ...event.body,
    ...event.queryStringParameters
  }

  // useCase - Update Ingredient
  const result = await updateIngredient(data);

  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-control-Allow-Methods':'PUT'
    },
    statusCode: 200,
    body: JSON.stringify({
      success: {
        title: 'Success',
        message: 'Ingredient updated successfully',
      },
      data: result,
    })
  };
})
.use(updateExceptionHandlerMiddleware());