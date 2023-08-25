import Joi from 'joi';
import { IComponentCreateEvent } from '@lib/interfaces';
import { middyfy } from '@lib/middleware/eventParserMiddleware';
import { bodyValidationMiddleware } from '@lib/middleware/validationMiddleware';
import { createExceptionHandlerMiddleware } from '@lib/middleware/exceptionHandlerMiddleware';
import { createComponent, createComponentIngredient } from './useCase';

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
      .min(1)
      .max(2)
      .valid('g', 'ml')
      .required()
  })

  // Validation before Processing
  await bodyValidationMiddleware(validationSchema)(event);

  // useCase - Create Component
  const component = await createComponent(event);

  // useCase - Create ComponentIngredient
  await createComponentIngredient(component, event)
  return component;
})
.use(createExceptionHandlerMiddleware());