import { PrismaClient } from '@prisma/client';
import IngredientRepository from '@lib/repositories/ingredientRepository';
import createError from 'http-errors';

export async function deleteIngredient(prisma: PrismaClient, id: string): Promise<any> {
  try {
    const ingredientRepo = new IngredientRepository(prisma);

    // Repo - Remove Ingredient from ComponentIngredient
    await ingredientRepo.removeIngredientFromComponentIngredient(prisma, id);

    // Repo - Delete Ingredient
    const result = await ingredientRepo.deleteIngredient(prisma, id);
    return result;
  } catch (err) {
    console.log('Error', err);
    throw createError(500, 'Internal Server Error', {
      details: 'An error occurred while processing the delete request',
    });
  }
}
