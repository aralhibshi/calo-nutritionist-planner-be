import { TGetEvent } from '@lib/interfaces';
import { middyfy } from '@lib/middleware/eventParserMiddleware';
import { readExceptionHandlerMiddleware } from '@lib/middleware/exceptionHandlerMiddleware';
import { getComponents } from './useCase';

export default middyfy(async (
  event: TGetEvent
): Promise<any> => {
  console.log('Received CloudFormation Event:', JSON.stringify(event, null, 2));

  // UseCase - Get Components
  const result = await getComponents();
  return result;
})
.use(readExceptionHandlerMiddleware());