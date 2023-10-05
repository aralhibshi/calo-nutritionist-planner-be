import Joi from 'joi';
import { IIngredientCreateEvent } from '@lib/interfaces';
import { middyfy } from '@lib/middleware/eventParserMiddleware';
import { bodyValidationMiddleware } from '@lib/middleware/validationMiddleware';
import { createExceptionHandlerMiddleware } from '@lib/middleware/exceptionHandlerMiddleware';
import { createIngredient } from './useCase';

export default middyfy(async (
  event: IIngredientCreateEvent
): Promise<any> => {
  console.log('Received CloudFormation Event:', JSON.stringify(event, null, 2));

  const validationSchema = Joi.object({
    name: Joi
      .string()
      .min(3)
      .required(),
    category: Joi
      .string()
      .valid(
        'Condiments & Sauces',
        'Dairy & Alternatives',
        'Fats & Oils',
        'Fruits',
        'Grains & Cereals',
        'Proteins',
        'Vegetables'
      )
      .required(),
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

  const { ...data } = event.body;

  // useCase - Create Ingredient
  const result = await createIngredient(data);

  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-control-Allow-Methods':'POST',
    },
    statusCode: 201,
    body: JSON.stringify({
      success: {
        title: 'Success',
        message: 'Ingredient created successfully'
      },
      data: result
    })
  };
})
.use(createExceptionHandlerMiddleware());