import Joi from 'joi';
import { PrismaClient } from '@prisma/client';
import { middyfy } from '@lib/middleware/eventParserMiddleware';
import { capitalizeFirstLetter } from 'src/utils/stringUtils';
import { updateIngredient } from './useCase';
import createError from 'http-errors';

const prisma = new PrismaClient();

export default middyfy(async (event) => {
  try {
    console.log('Received CloudFormation Event:', JSON.stringify(event, null, 2));

    const validationSchema = Joi.object({
      id: Joi.string().min(36).required(),
      name: Joi.string().required(),
      category: Joi.string(),
      description: Joi.string(),
      price: Joi.number().required(),
      protein: Joi.number().required(),
      fats: Joi.number().required(),
      carbs: Joi.number().required(),
      unit: Joi.string().required()
    })

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

    const ingredientId = event.body.id;
    delete event.body.id;

    // useCase - Update Ingredient
    const result = await updateIngredient(prisma, ingredientId, ingredientData);
    return result;
  } catch (err) {
    console.log('Error', err);
    throw createError(500, 'Internal Server Error', {
      details: 'An error occurred while fetching ingredients',
    });
  }
})