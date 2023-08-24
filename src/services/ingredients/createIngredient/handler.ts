import Joi from 'joi';
import { PrismaClient } from '@prisma/client';
import { IIngredientCreateEvent } from '@lib/interfaces';
import { middyfy } from '@lib/middleware/eventParserMiddleware';
import { bodyValidationMiddleware } from '@lib/middleware/validationMiddleware';
import { exceptionHandlerMiddleware } from '@lib/middleware/exceptionHandlerMiddleware';
import { createIngredient } from './useCase';

const prisma = new PrismaClient();

export default middyfy(async (event: IIngredientCreateEvent) => {
  console.log('Received CloudFormation Event:', JSON.stringify(event, null, 2));

  const validationSchema = Joi.object({
    name: Joi
      .string()
      .required(),
    category: Joi
      .string(),
    description: Joi
      .string(),
    price: Joi
      .number()
      .max(999.999)
      .required(),
    protein: Joi
      .number()
      .max(0.999)
      .required(),
    fats: Joi
      .number()
      .max(0.999)
      .required(),
    carbs: Joi
      .number()
      .max(0.999)
      .required(),
    unit: Joi
      .string()
      .max(2)
      .valid('g', 'ml')
      .required(),
  });

  // Validation before Processing
  await bodyValidationMiddleware(validationSchema)(event);

  // useCase - Create Ingredient
  const result = await createIngredient(prisma, event);
  return result;
})
.use(exceptionHandlerMiddleware());