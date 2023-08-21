import Joi from 'joi';
import { PrismaClient, Prisma } from '@prisma/client';
import { middyfy } from '@lib/middleware';
import { createMeal } from './useCase';
import { createMealComponent } from './useCase';
import { capitalizeFirstLetter } from 'src/utils/stringUtils';
import createError from 'http-errors';

const prisma = new PrismaClient();

export default middyfy(async (event) => {
  try {
    console.log('Received CloudFormation Event:', JSON.stringify(event, null, 2));

    // Joi Validation Schema
    const validationSchema = Joi.object({
      name: Joi.string().required(),
      size: Joi.string().required(),
      unit: Joi.string().required(),
      components: Joi.array()
      .min(1)
      .required()
    })

    // Asynchronous Validation
    try {
      await validationSchema.validateAsync(event.body);
    } catch (validationError) {
      throw createError(400, 'Validation Error', {
        details: validationError.details.map(detail => detail.message),
      });
    }

    const mealData = {
      ...event.body,
      name: capitalizeFirstLetter(event.body.name),
      size: capitalizeFirstLetter(event.body.size),
    };
    const components = mealData.components;
    delete mealData.components;

    // useCase - Create Meal
    const result = await createMeal(prisma, mealData);

    // useCase - Create Meal Component
    const parsedResult = JSON.parse(result.body)
    const mealId = parsedResult.data.id;
    
    await createMealComponent(prisma, mealId, components)

    return result;
  } catch (err) {
    console.log('Error:', err);
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      console.log('Conflict Error:', err);
      throw createError(409, 'Conflict Error', {
        details: err,
      });
    }
    throw createError(500, 'Internal Server Error', {
      details: 'An error occurred while creating the meal',
    });
  }
});