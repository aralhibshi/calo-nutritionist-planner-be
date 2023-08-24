import Joi from 'joi';
import { PrismaClient } from '@prisma/client';
import { IComponentCreateEvent } from '@lib/interfaces';
import { middyfy } from '@lib/middleware/eventParserMiddleware';
import { bodyValidationMiddleware } from '@lib/middleware/validationMiddleware';
import { createExceptionHandlerMiddleware } from '@lib/middleware/exceptionHandlerMiddleware';
import { createComponent } from './useCase';
import { createComponentIngredient } from './useCase';

const prisma = new PrismaClient();

export default middyfy(async (event: IComponentCreateEvent): Promise<any> => {
  console.log('Received CloudFormation Event:', JSON.stringify(event, null, 2));

  const validationSchema = Joi.object({
    ingredients: Joi
      .array()
      .min(1)
      .required(),
    name: Joi
      .string()
      .min(3)
      .required(),
    unit: Joi
      .string()
      .max(2)
      .valid('g', 'ml')
      .required()
  })

  // Validation before Processing
  await bodyValidationMiddleware(validationSchema)(event);

  // useCase - Create Component
  const component = await createComponent(prisma, event);

  // useCase - Create ComponentIngredient
  await createComponentIngredient(prisma, component, event)
  return component;
})
.use(createExceptionHandlerMiddleware());