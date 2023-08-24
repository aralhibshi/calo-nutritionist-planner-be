import createError from 'http-errors';

export const validationMiddleware = (validationSchema) => {
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