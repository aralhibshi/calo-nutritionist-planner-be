import { PrismaClient } from '@prisma/client';
import { middyfy } from '@lib/middleware/eventParserMiddleware';
import { readExceptionHandlerMiddleware } from '@lib/middleware/exceptionHandlerMiddleware';
import { getIngredients } from './useCase';

const prisma = new PrismaClient();

export default middyfy(async (event) => {
  console.log('Received CloudFormation Event:', JSON.stringify(event, null, 2));

  // useCase - Get Ingredients
  const result = await getIngredients(prisma);
  return result;
})
.use(readExceptionHandlerMiddleware());