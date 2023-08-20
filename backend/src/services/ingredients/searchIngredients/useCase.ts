import { PrismaClient } from '@prisma/client';
import IngredientRepository from '@lib/repositories/ingredientRepository';
import createError from 'http-errors';

export async function searchIngredients(prisma: PrismaClient, index: any): Promise<any> {
  try {
    const ingredientRepo = new IngredientRepository(prisma);

    // Repo - Search Ingredients
    const result = await ingredientRepo.searchIngredients(index);

    console.log('Ingredients fetched successfully');

    return result;
  } catch (err) {
    console.log('Error', err);
    throw createError(500, 'Internal Server Error', {
      details: 'An error occurred while processing the request',
    });
  }
}