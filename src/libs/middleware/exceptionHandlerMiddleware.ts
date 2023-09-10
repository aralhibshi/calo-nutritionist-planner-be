import { Prisma } from '@prisma/client';
import { MiddlewareObj } from '@middy/core';
import createError from 'http-errors';

// Create
export const createExceptionHandlerMiddleware = (): MiddlewareObj<any, any, Error, any> => {
  return {
    onError: async (handler) => {
      const { error } = handler;

      console.error('Error:', error);

      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw createError(409, 'Conflict Error', {
          details: error.message,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-control-Allow-Methods':'POST',
          }
        });
      }

      throw createError(500, 'Internal Server Error', {
        details: 'An error occurred while processing the create request',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-control-Allow-Methods':'POST',
        }
      });
    },
  };
};

// Read
export const readExceptionHandlerMiddleware = (): MiddlewareObj<any, any, Error, any> => {
  return {
    onError: async (handler) => {
      const { error } = handler;

      console.error('Error:', error);

      throw createError(500, 'Internal Server Error', {
        details: 'An error occurred while processing the get request',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-control-Allow-Methods':'GET',
        }
      });
    },
  };
};

// Update
export const updateExceptionHandlerMiddleware = (): MiddlewareObj<any, any, Error, any> => {
  return {
    onError: async (handler) => {
      const { error } = handler;

      console.error('Error:', error);

      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw createError(409, 'Conflict Error', {
          details: error.message,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-control-Allow-Methods':'PUT',
          }
        });
      }

      throw createError(500, 'Internal Server Error', {
        details: 'An error occurred while processing the update request',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-control-Allow-Methods':'PUT',
        }
      });
    },
  };
};

// Delete
export const deleteExceptionHandlerMiddleware = (): MiddlewareObj<any, any, Error, any> => {
  return {
    onError: async (handler) => {
      const { error } = handler;

      console.error('Error:', error);

      throw createError(500, 'Internal Server Error', {
        details: 'An error occurred while processing the delete request',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-control-Allow-Methods':'DELETE',
        }
      });
    },
  };
};