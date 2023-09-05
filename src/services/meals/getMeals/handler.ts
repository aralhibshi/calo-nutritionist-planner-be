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
      .max(500)
      .required(),
    take: Joi
      .number()
      .min(9)
      .max(500)
      .required(),
    name: Joi
      .string()
      .min(1),
    component_id: Joi
      .string()
      .min(36)
      .max(36)
  })

  // Validation before Processing
  await queryValidationMiddleware(validationSchema)(event);

  const { ...data } = event.queryStringParameters;

  // useCase - Get Ingredients
  const result = await getMeals(data);

  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-control-Allow-Methods':'GET',
    },
    statusCode: 200,
    body: JSON.stringify({
      success: {
        title: 'Success',
        message: 'Meals fetched successfully'
      },
      data: result
    })
  };
})
.use(readExceptionHandlerMiddleware())