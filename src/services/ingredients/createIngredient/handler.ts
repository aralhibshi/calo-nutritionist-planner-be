import Joi from 'joi';
import { PrismaClient } from '@prisma/client';
import { createIngredient } from './useCase';
import { validationMiddleware } from '@lib/middleware/validationMiddleware';
import { exceptionHandlerMiddleware } from '@lib/middleware/exceptionHandlerMiddleware';
import { middyfy } from '@lib/middleware/eventParserMiddleware';
import { IIngredientCreateEvent } from '@lib/interfaces';

const prisma = new PrismaClient();

export default middyfy(async (event: IIngredientCreateEvent) => {
  console.log('Received CloudFormation Event:', JSON.stringify(event, null, 2));

  const validationSchema = Joi.object({
    name: Joi.string().required(),
      category: Joi.string(),
      description: Joi.string(),
      price: Joi
        .number()
        .max(99.999)
        .required(),
      protein: Joi
        .number()
        .max(99.999)
        .required(),
      fats: Joi
        .number()
        .max(99.999)
        .required(),
      carbs: Joi
        .number()
        .max(99.999)
        .required(),
      unit: Joi
        .string()
        .valid('g', 'ml')
        .required(),
  });

  // Validation before Processing
  await validationMiddleware(validationSchema)(event);

  const ingredientData = {
    ...event.body
  };

  // useCase - Create Ingredient
  const result = await createIngredient(prisma, ingredientData);
  return result;
})
  .use(exceptionHandlerMiddleware());