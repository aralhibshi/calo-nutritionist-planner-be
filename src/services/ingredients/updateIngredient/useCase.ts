import { PrismaClient } from '@prisma/client';
import IngredientRepository from '@lib/repositories/ingredientRepository';
import createError from 'http-errors';

interface IngredientData {
  name: string;
  category?: string;
  description?: string;
  price: number;
  protein: number;
  fats: number;
  carbs: number;
  unit: string;
}

export async function updateIngredient(
  prisma: PrismaClient,
  id: string,
  data: IngredientData
): Promise<any> {
  const ingredientRepo = new IngredientRepository(prisma);

  try {
    // Repo - Update Ingredient
    const result = await ingredientRepo.updateIngredient(id, data);
    return result;
  } catch (err) {
    console.log('Error', err);
    throw createError(500, 'Internal Server Error', {
      details: 'An error occurred while processing the request',
    });
  }
}