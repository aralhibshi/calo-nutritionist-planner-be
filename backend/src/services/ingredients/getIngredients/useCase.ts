import { PrismaClient } from '@prisma/client';
import IngredientRepository from '@lib/repositories/ingredientRepository';
import createError from 'http-errors';

export async function getIngredients(prisma: PrismaClient): Promise<any> {
  try {
    const ingredientRepo = new IngredientRepository(prisma);

    // Repo - Get Ingredients
    const result = await ingredientRepo.getIngredients();

    console.log('Ingredients fetched successfully');

    return result;
  } catch (err) {
    console.log('Internal Error:', err);
    throw createError(500, 'Internal Server Error', {
      details: 'An error occurred while fetching ingredients',
    });
  }
}