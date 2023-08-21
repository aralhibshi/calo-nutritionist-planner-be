import { PrismaClient } from '@prisma/client';
import { middyfy } from '@lib/middleware';
import { getComponents } from './useCase';
import createError from 'http-errors';

const prisma = new PrismaClient();

export default middyfy(async (event) => {
  try {
    console.log('Received CloudFormation Event:', JSON.stringify(event, null, 2));

    // UseCase - Get Components
    const result = await getComponents(prisma);
    return result;
  } catch (err) {
    console.log('Error', err);
    throw createError(500, 'Internal Server Error', {
      details: 'An error occurred while fetching components',
    });
  }
})