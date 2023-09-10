import Joi from 'joi';
import { IMealUpdateEvent } from 'calo-nutritionist-planner/src/libs/interfaces';
import { middyfy } from 'libs/middleware/eventParserMiddleware';
import { queryValidationMiddleware } from 'libs/middleware/validationMiddleware';
import { bodyValidationMiddleware } from 'libs/middleware/validationMiddleware';
import { updateExceptionHandlerMiddleware } from 'libs/middleware/exceptionHandlerMiddleware';
import { updateMeal, updateMealComponent } from './useCase';

export default middyfy(async (
  event: IMealUpdateEvent 
): Promise<any> => {
  console.log('Received CloudFormation Event:', JSON.stringify(event, null, 2));

  const queryValidationSchema = Joi.object({
    id: Joi
      .string()
      .min(36)
      .required(),
  })
  const bodyValidationSchema = Joi.object({
    components: Joi
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
    size: Joi
      .string()
      .min(1)
      .max(1)
      .valid('S', 'M', 'L')
      .required(),
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
  await updateMealComponent(data, event.body.components)
  // await updateComponentInMealComponent(data)
  const result = await updateMeal(data);

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