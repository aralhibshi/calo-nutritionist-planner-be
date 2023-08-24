import { PrismaClient } from '@prisma/client';
import IngredientRepository from '@lib/repositories/ingredientRepository';
import createError from 'http-errors';
import { capitalizeFirstLetter } from 'src/utils/stringUtils';

export async function createIngredient(prisma: PrismaClient, data: any): Promise<any> {
  try {
    const ingredientData = {
      ...data,
      name: capitalizeFirstLetter(data.name)
    }

    const ingredientRepo = new IngredientRepository(prisma);

    // Repo - Create Ingredient
    const result = await ingredientRepo.createIngredient(ingredientData);

    console.log('Ingredient created successfully', result);

    return result;
  } catch (err) {
    console.log('Error:', err);
    throw createError(500, 'Internal Server Error', {
      details: 'An error occurred while creating the ingredient.',
    });
  }
}