import Joi from 'joi';
import { IComponentCreateEvent } from '@lib/interfaces';
import { middyfy } from '@lib/middleware/eventParserMiddleware';
import { bodyValidationMiddleware } from '@lib/middleware/validationMiddleware';
import { createExceptionHandlerMiddleware } from '@lib/middleware/exceptionHandlerMiddleware';
import { createComponent, createComponentIngredient } from './useCase';

export default middyfy(async (
  event: IComponentCreateEvent
): Promise<any> => {
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
    category: Joi
      .string(),
    description: Joi
      .string(),
    unit: Joi
      .string()
      .min(1)
      .max(2)
      .valid('g', 'ml')
      .required()
  })

  // Validation before Processing
  await bodyValidationMiddleware(validationSchema)(event);

  const { ingredients: componentIngredientData, ...componentData } = event.body;

  // useCase - Create Component
  const component = await createComponent(componentData);

  // useCase - Create ComponentIngredient
  await createComponentIngredient(component, componentIngredientData)

  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-control-Allow-Methods':'POST',
    },
    statusCode: 201,
    body: JSON.stringify({
      success: {
        title: 'Success',
        message: 'Component created successfully'
      },
      data: {
        ...component,
      }
    })
  }
})
.use(createExceptionHandlerMiddleware());