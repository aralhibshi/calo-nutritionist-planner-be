import Joi from 'joi';
import { IComponentCreateEvent } from 'calo-nutritionist-planner/src/libs/interfaces';
import { middyfy } from 'libs/middleware/eventParserMiddleware';
import { bodyValidationMiddleware } from 'libs/middleware/validationMiddleware';
import { createExceptionHandlerMiddleware } from 'libs/middleware/exceptionHandlerMiddleware';
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

  // Data Separation
  const { ingredients, ...componentData } = event.body;

  // useCase - Create Component
  const component = await createComponent(componentData);

  // useCase - Create ComponentIngredient
  await createComponentIngredient(component, ingredients)

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