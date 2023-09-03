import Joi from 'joi';
import { IComponentSearchEvent, IComponentSearchData } from '@lib/interfaces';
import { middyfy } from '@lib/middleware/eventParserMiddleware';
import { queryValidationMiddleware } from '@lib/middleware/validationMiddleware';
import { readExceptionHandlerMiddleware } from '@lib/middleware/exceptionHandlerMiddleware';
import { searchComponents } from './useCase';

export default middyfy(async (
  event: IComponentSearchEvent
): Promise<any> => {
  console.log('Received CloudFormation Event:', JSON.stringify(event, null, 2));

  const validationSchema = Joi.object({
    name: Joi
      .string()
      .min(1)
      .required(),
    skip: Joi
      .number()
      .min(0)
      .required()
  })

  // Validation before Processing
  await queryValidationMiddleware(validationSchema)(event)

  const data: IComponentSearchData = {
    ...event.queryStringParameters
  }
 
  // useCase - Search Components
  const result = await searchComponents(data);

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