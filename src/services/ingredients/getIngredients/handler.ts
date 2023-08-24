import { PrismaClient } from '@prisma/client';
import { middyfy } from '@lib/middleware/eventParserMiddleware';
import { getIngredients } from './useCase';
import createError from 'http-errors';

const prisma = new PrismaClient();

export default middyfy(async (event) => {
  try {
    console.log('Received CloudFormation Event:', JSON.stringify(event, null, 2));

    // Prisma - Get Ingredients
    const result = await getIngredients(prisma);
    return result;
  } catch (err) {
    console.log('Error', err)
    throw createError(500, 'Internal Server Error', {
      details: 'An error occurred while creating the ingredient',
    });
  }
})