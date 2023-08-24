import { PrismaClient } from '@prisma/client';
import IngredientRepository from '@lib/repositories/ingredientRepository';

export async function getIngredients(prisma: PrismaClient): Promise<any> {
  const ingredientRepo = new IngredientRepository(prisma);

  // Repo - Get Ingredients
  const result = await ingredientRepo.getIngredients();

  console.log('Ingredients fetched successfully');
  return result;
}