import Joi from 'joi';
import { IComponentGetEvent } from 'calo-nutritionist-planner/src/libs/interfaces';
import { middyfy } from 'libs/middleware/eventParserMiddleware';
import { queryValidationMiddleware } from 'libs/middleware/validationMiddleware';
import { readExceptionHandlerMiddleware } from 'libs/middleware/exceptionHandlerMiddleware';
import { getComponents } from './useCase';

export default middyfy(async (
  event: IComponentGetEvent
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
      .min(1),
    ingredient_id: Joi
      .string()
      .min(36)
      .max(36)
  })

  // Validation before Processing
  await queryValidationMiddleware(validationSchema)(event)

  const { ...data } = event.queryStringParameters;

  // UseCase - Get Components
  const result = await getComponents(data);
  
  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-control-Allow-Methods':'GET',
    },
    statusCode: 200,
    body: JSON.stringify({
      success: {
        title: 'Success',
        message: 'Components fetched successfully',
      },
      data: result
    })
  };
})
.use(readExceptionHandlerMiddleware());