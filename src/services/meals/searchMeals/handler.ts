import Joi from 'joi';
import { IMealSearchEvent } from '@lib/interfaces';
import { middyfy } from '@lib/middleware/eventParserMiddleware';
import { queryValidationMiddleware } from '@lib/middleware/validationMiddleware';
import { readExceptionHandlerMiddleware } from '@lib/middleware/exceptionHandlerMiddleware';
import { searchMeals } from './useCase';

export default middyfy(async (
  event: IMealSearchEvent
): Promise<any> => {
  console.log('Received CloudFormation Event:', JSON.stringify(event, null, 2));

  const validationSchema = Joi.object({
    name: Joi
      .string()
      .min(1)
      .required()
  })

  // Validation before Processing
  await queryValidationMiddleware(validationSchema)(event);

  const { ...data } = event.queryStringParameters

  // useCase - Search Ingredients
  const result = await searchMeals(data);

  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-control-Allow-Methods':'GET',
    },
    statusCode: 200,
    body: JSON.stringify({
      success: {
        title: 'Success',
        message: 'Meals fetched successfully',
      },
      data: result
    })
  };
})
.use(readExceptionHandlerMiddleware());