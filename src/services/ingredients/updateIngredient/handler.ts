import Joi from 'joi';
import { PrismaClient } from '@prisma/client';
import { IIngredientUpdateEvent } from '@lib/interfaces';
import { middyfy } from '@lib/middleware/eventParserMiddleware';
import { queryValidationMiddleware } from '@lib/middleware/validationMiddleware';
import { bodyValidationMiddleware } from '@lib/middleware/validationMiddleware';
import { updateExceptionHandlerMiddleware } from '@lib/middleware/exceptionHandlerMiddleware';
import { updateIngredient } from './useCase';

const prisma = new PrismaClient();

export default middyfy(async (event: IIngredientUpdateEvent): Promise<any> => {
  console.log('Received CloudFormation Event:', JSON.stringify(event, null, 2));

  const queryValidationSchema = Joi.object({
    id: Joi
      .string()
      .min(36)
      .required(),
  })

  const bodyValidationSchema = Joi.object({
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
  await queryValidationMiddleware(queryValidationSchema)(event);
  await bodyValidationMiddleware(bodyValidationSchema)(event);

  // useCase - Update Ingredient
  const result = await updateIngredient(prisma, event);
  return result;
})
.use(updateExceptionHandlerMiddleware());