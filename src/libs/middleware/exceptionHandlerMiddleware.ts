import { MiddlewareObj } from '@middy/core';
import createError from 'http-errors';
import { Prisma } from '@prisma/client';

export const exceptionHandlerMiddleware = (): MiddlewareObj<any, any, Error, any> => {
  return {
    onError: async (handler) => {
      const { error } = handler;

      console.error('Error:', error);

      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw createError(409, 'Conflict Error', {
          details: error.message,
        });
      }

      throw createError(500, 'Internal Server Error', {
        details: 'An error occurred while processing the request',
      });
    },
  };
};