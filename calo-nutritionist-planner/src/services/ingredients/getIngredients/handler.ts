import Joi from 'joi';
import { IIngredientGetEvent } from 'calo-nutritionist-planner/src/libs/interfaces';
import { middyfy } from 'libs/middleware/eventParserMiddleware';
import { queryValidationMiddleware } from 'libs/middleware/validationMiddleware';
import { readExceptionHandlerMiddleware } from 'libs/middleware/exceptionHandlerMiddleware';
import { getIngredients } from './useCase';

export default middyfy(async (
  event: IIngredientGetEvent
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
      .min(6)
      .max(500)
      .required(),
    name: Joi
      .string()
      .min(1)
  })

  // Validation befor Processing
  await queryValidationMiddleware(validationSchema)(event)

  const { ...data } = event.queryStringParameters

  // useCase - Get Ingredients
  const result = await getIngredients(data);
  
  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-control-Allow-Methods':'GET',
    },
    statusCode: 200,
    body: JSON.stringify({
      success: {
        title: 'Success',
        message: 'Ingredients fetched successfully',
      },
      data: result
    })
  };
})
.use(readExceptionHandlerMiddleware());