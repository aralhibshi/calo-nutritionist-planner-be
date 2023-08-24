import Joi from 'joi';
import { PrismaClient } from '@prisma/client';
import { middyfy } from '@lib/middleware/eventParserMiddleware';
import { removeMealFomMealComponent } from './useCase';
import { deleteMeal } from './useCase';
import createError from 'http-errors';

const prisma = new PrismaClient();

export default middyfy(async (event) => {
  try {
    console.log('Received CloudFormation Event:', JSON.stringify(event, null, 2));

    // Joi Validation Schema
    const validationSchema = Joi.object({
      id: Joi.string()
      .min(36)
      .required()
    })

    // Asynchronous Validation
    try {
      await validationSchema.validateAsync(event.queryStringParameters);
    } catch (validationError) {
      throw createError(400, 'Validation Error', {
        details: validationError.details.map(detail => detail.message),
      });
    }

    const mealId = event.queryStringParameters && event.queryStringParameters.id;

    // useCase - Remove Meal from MealComponent
    await removeMealFomMealComponent(prisma, mealId);

    // useCase - Delete Ingredient
    const result = await deleteMeal(prisma, mealId);
    return result;
  } catch (err) {
    console.log('Error', err);
    throw createError(500, 'Internal Server Error', {
      details: 'An error occurred while deleting the meal',
    });
  }
});