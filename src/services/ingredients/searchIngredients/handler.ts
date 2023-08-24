import Joi from 'joi';
import { PrismaClient } from '@prisma/client';
import { middyfy } from '@lib/middleware/eventParserMiddleware';
import { capitalizeFirstLetter } from 'src/utils/stringUtils';
import { searchIngredients } from './useCase';
import createError from 'http-errors';

const prisma = new PrismaClient();

export default middyfy(async (event) => {
  try {
    console.log('Received CloudFormation Event:', JSON.stringify(event, null, 2));

    const ingredientName = event.queryStringParameters && event.queryStringParameters.name;

    if (!ingredientName) {
      throw createError(400, 'Validation Error', {
        details: 'Missing or invalid query parameter "name"',
      });
    } else {
      const capitalizedIngredientName = capitalizeFirstLetter(ingredientName);

      // useCase - Search Ingredients
      const result = await searchIngredients(prisma, capitalizedIngredientName);
      return result;
    }
  } catch (err) {
    console.log('Error', err);
    throw createError(500, 'Internal Server Error', {
      details: 'An error occurred while fetching ingredients',
    });
  }
});