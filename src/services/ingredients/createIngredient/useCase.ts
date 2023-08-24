import { PrismaClient } from '@prisma/client';
import { IIngredientCreateEvent } from '@lib/interfaces';
import IngredientRepository from '@lib/repositories/ingredientRepository';
import { capitalizeFirstLetter } from 'src/utils/stringUtils';

export async function createIngredient(
  prisma: PrismaClient,
  event: IIngredientCreateEvent
  ): Promise<any> {
  const ingredientRepo = new IngredientRepository(prisma);

  const ingredientData = {
    ...event.body,
    name: capitalizeFirstLetter(event.body.name)
  }

  // Repo - Create Ingredient
  const result = await ingredientRepo.createIngredient(ingredientData);
  return result;
}