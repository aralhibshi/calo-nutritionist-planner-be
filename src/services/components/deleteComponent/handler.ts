import Joi from 'joi';
import { middyfy } from '@lib/middleware/eventParserMiddleware';
import { queryValidationMiddleware } from '@lib/middleware/validationMiddleware';
import { deleteExceptionHandlerMiddleware } from '@lib/middleware/exceptionHandlerMiddleware';
import { removeComponentFomMealComponent, removeComponentFromComponentIngredient, deleteComponent } from './useCase';

export default middyfy(async (event): Promise<any> => {
  console.log('Received CloudFormation Event:', JSON.stringify(event, null, 2));

  const validationSchema = Joi.object({
    id: Joi.string()
    .min(36)
    .required()
  });

  // Validation before Processing
  await queryValidationMiddleware(validationSchema)(event);

  // useCase - Remove Component from ComponentIngredient
  await removeComponentFromComponentIngredient(event);

  // useCase - Remove Component from MealComponent
  await removeComponentFomMealComponent(event);

  // useCase - Delete Component
  const result = await deleteComponent(event);
  return result;
})
.use(deleteExceptionHandlerMiddleware());