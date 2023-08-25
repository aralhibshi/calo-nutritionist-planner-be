import { TGetEvent } from '@lib/interfaces';
import { middyfy } from '@lib/middleware/eventParserMiddleware';
import { getMeals } from './useCase';

export default middyfy(async (
  event: TGetEvent
): Promise<any> => {
  console.log('Received CloudFormation Event:', JSON.stringify(event, null, 2));

  // useCase - Get Ingredients
  const result = await getMeals();
  return result;
})