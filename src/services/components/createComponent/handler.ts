import Joi from 'joi';
import { Prisma, PrismaClient } from '@prisma/client';
import { middyfy } from '@lib/middleware/eventParserMiddleware';
import { capitalizeFirstLetter } from 'src/utils/stringUtils';
import { createComponent } from './useCase';
import { createComponentIngredient } from './useCase';
import createError from 'http-errors';

const prisma = new PrismaClient();

export default middyfy(async (event) => {
  try {
    console.log('Received CloudFormation Event:', JSON.stringify(event, null, 2));

    // Joi Validation Schema
    const validationSchema = Joi.object({
      ingredients: Joi.array().required(),
      name: Joi.string().required(),
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

    const componentData = {
      ...event.body,
      name: capitalizeFirstLetter(event.body.name),
    };
    const ingredients = componentData.ingredients;
    delete componentData.ingredients;

    // useCase - Create Component
    const result = await createComponent(prisma, componentData);

    // useCase - Create ComponentIngredient
    const parsedResult = JSON.parse(result.body)
    const componentId = parsedResult.data.id;

    await createComponentIngredient(prisma, componentId, ingredients)

    return result;
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      console.log('Conflict Error:', err);
      throw createError(409, 'Conflict Error', {
        details: err,
      });
    }
    throw createError(500, 'Internal Server Error', {
      details: 'An error occurred while creating the component',
    });
  }
})