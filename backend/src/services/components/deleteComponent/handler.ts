import Joi from 'joi';
import { PrismaClient } from '@prisma/client';
import { middyfy } from '@lib/middleware';
import { removeComponentFomMealComponent, removeComponentFromComponentIngredient } from './useCase';
import { deleteComponent } from './useCase';
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
    });

     // Asynchronous Validation
     try {
      await validationSchema.validateAsync(event.queryStringParameters);
    } catch (validationError) {
      throw createError(400, 'Validation Error', {
        details: validationError.details.map(detail => detail.message),
      });
    }

    const componentId = event.queryStringParameters && event.queryStringParameters.id;

    // useCase - Remove Component from ComponentIngredient
    await removeComponentFromComponentIngredient(prisma, componentId);

    // useCase - Remove Component from MealComponent
    await removeComponentFomMealComponent(prisma, componentId);

    // useCase - Delete Component
    const result = await deleteComponent(prisma, componentId);
    return result;
  } catch (err) {
    console.log('Error', err);
    throw createError(500, 'Internal Server Error', {
      details: 'An error occurred while deleting the component',
    });
  }
});