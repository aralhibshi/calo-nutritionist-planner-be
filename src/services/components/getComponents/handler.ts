import prisma from '@lib/prismaClient';
import { middyfy } from '@lib/middleware/eventParserMiddleware';
import { getComponents } from './useCase';
import createError from 'http-errors';

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