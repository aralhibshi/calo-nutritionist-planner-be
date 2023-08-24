import Joi from 'joi';
import { middyfy } from '@lib/middleware/eventParserMiddleware';
import { deleteIngredient } from './useCase';
import createError from 'http-errors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default middyfy(async (event) => {
  try {
    console.log('Received CloudFormation Event:', JSON.stringify(event, null, 2));

    // Joi Validation Schema
    const validationSchema = Joi.object({
      id: Joi.string().required(),
    });

    // Asynchronous Validation
    try {
      await validationSchema.validateAsync(event.queryStringParameters);
    } catch (validationError) {
      throw createError(400, 'Validation Error', {
        details: validationError.details.map(detail => detail.message),
      });
    }

    const ingredientId = event.queryStringParameters.id;

    // useCase - Delete Ingredient
    const result = await deleteIngredient(prisma, ingredientId);
    return result;
  } catch (err) {
    console.log('Error', err);
    throw createError(500, 'Internal Server Error', {
      details: 'An error occurred while deleting the ingredient',
    });
  }
});