import Joi from 'joi';
import { Prisma, PrismaClient } from '@prisma/client';
import { middyfy } from '@lib/middleware';
import { capitalizeFirstLetter } from 'src/utils/stringUtils';
import { createIngredient } from './useCase';
import createError from 'http-errors';

const prisma = new PrismaClient();

export default middyfy(async (event) => {
  try {
    console.log('Received CloudFormation Event:', JSON.stringify(event, null, 2));

    // Joi Validation Schema
    const validationSchema = Joi.object({
      name: Joi.string().required(),
      category: Joi.string(),
      description: Joi.string(),
      price: Joi.number().required(),
      protein: Joi.number().required(),
      fats: Joi.number().required(),
      carbs: Joi.number().required(),
      unit: Joi
      .string()
      .valid('g', 'ml')
      .required(),
    });

    // Asynchronous Validation
    try {
      await validationSchema.validateAsync(event.body);
    } catch (validationError) {
      throw createError(400, 'Validation Error', {
        details: validationError.details.map(detail => detail.message),
      });
    }

    const ingredientData = {
      ...event.body,
      name: capitalizeFirstLetter(event.body.name),
    };

    // useCase - Create Ingredient
    const result = await createIngredient(prisma, ingredientData);
    return result;
  } catch (err) {
    console.log('Error:', err);

    // Map specific error types to HTTP errors
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      throw createError(409, 'Conflict Error', {
        details: err.message,
      });
    }

    throw createError(500, 'Internal Server Error', {
      details: 'An error occurred while creating the ingredient',
    });
  }
});