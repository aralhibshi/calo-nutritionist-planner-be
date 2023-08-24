import { PrismaClient } from '@prisma/client';
import IngredientRepository from '@lib/repositories/ingredientRepository';
import createError from 'http-errors';
import { capitalizeFirstLetter } from 'src/utils/stringUtils';
import { IIngredientCreateEvent } from '@lib/interfaces';

export async function createIngredient(prisma: PrismaClient, event: IIngredientCreateEvent): Promise<any> {
  try {
    const ingredientRepo = new IngredientRepository(prisma);

    const ingredientData = {
      ...event.body,
      name: capitalizeFirstLetter(event.body.name)
    }

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