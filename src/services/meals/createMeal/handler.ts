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

  // Data Separation
  const { components, ...mealData } = event.body

  // useCase - Create Meal
  const meal = await createMeal(mealData);

  // useCase - Create Meal Component
  await createMealComponent(meal, components)

  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-control-Allow-Methods':'POST',
    },
    statusCode: 201,
    body: JSON.stringify({
      success: {
        title: 'Success',
        message: 'Meal created successfully'
      },
      data: meal
    })
  };
})
.use(createExceptionHandlerMiddleware());