import Joi from 'joi';
import { IComponentDeleteEvent } from 'calo-nutritionist-planner/src/libs/interfaces';
import { middyfy } from 'libs/middleware/eventParserMiddleware';
import { queryValidationMiddleware } from 'libs/middleware/validationMiddleware';
import { deleteExceptionHandlerMiddleware } from 'libs/middleware/exceptionHandlerMiddleware';
import { removeComponentFomMealComponent, removeComponentFromComponentIngredient, deleteComponent } from './useCase';

export default middyfy(async (
  event: IComponentDeleteEvent
): Promise<any> => {
  console.log('Received CloudFormation Event:', JSON.stringify(event, null, 2));

  const validationSchema = Joi.object({
    id: Joi.string()
    .min(36)
    .required()
  });

  // Validation before Processing
  await queryValidationMiddleware(validationSchema)(event);

  const { ...data } = event.queryStringParameters;

  // useCase - Remove Component from ComponentIngredient
  await removeComponentFromComponentIngredient(data);

  // useCase - Remove Component from MealComponent
  await removeComponentFomMealComponent(data);

  // useCase - Delete Component
  const result = await deleteComponent(data);

  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-control-Allow-Methods':'DELETE',
    },
    statusCode: 200,
    body: JSON.stringify({
      success: {
        title: 'Success',
        message: 'Component deleted successfully',
      },
      data: result
    })
  };
})
.use(deleteExceptionHandlerMiddleware());