import Joi from 'joi';
import { IMealCreateEvent } from '@lib/interfaces';
import { middyfy } from '@lib/middleware/eventParserMiddleware';
import { bodyValidationMiddleware } from '@lib/middleware/validationMiddleware';
import { createExceptionHandlerMiddleware } from '@lib/middleware/exceptionHandlerMiddleware';
import { createMeal, createMealComponent } from './useCase';

export default middyfy(async (
  event: IMealCreateEvent
): Promise<any> => {
  console.log('Received CloudFormation Event:', JSON.stringify(event, null, 2));

  const validationSchema = Joi.object({
    components: Joi
      .array()
      .min(1)
      .required(),
    name: Joi
      .string()
      .min(3)
      .required(),
    description: Joi
      .string(),
    size: Joi
      .string()
      .min(1)
      .max(1)
      .valid('S', 'M', 'L')
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

  // useCase - Create Meal
  const meal = await createMeal(event);

  // useCase - Create Meal Component
  await createMealComponent(meal, event)
  return meal;
})
.use(createExceptionHandlerMiddleware());