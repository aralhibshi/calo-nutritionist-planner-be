import createError from 'http-errors';

export const bodyValidationMiddleware = (validationSchema) => {
  return async (event) => {
    try {
      await validationSchema.validateAsync(event.body);
    } catch (validationError) {
      throw createError(400, 'Validation Error', {
        details: validationError.details.map((detail) => detail.message),
      });
    }
  };
};

export const queryValidationMiddleware = (validationSchema) => {
  return async (event) => {
    try {
      await validationSchema.validateAsync(event.queryStringParameters);
    } catch (validationError) {
      throw createError(400, 'Validation Error', {
        details: validationError.details.map((detail) => detail.message),
      });
    }
  };
};