import { PrismaClient } from '@prisma/client';
import { IIngredientSearchEvent } from '@lib/interfaces';
import IngredientRepository from '@lib/repositories/ingredientRepository';
import { capitalizeFirstLetter } from 'src/utils/stringUtils';

export async function searchIngredients(prisma: PrismaClient, event: IIngredientSearchEvent): Promise<any> {
  const ingredientRepo = new IngredientRepository(prisma);

  const index = capitalizeFirstLetter(event.queryStringParameters.name);

  // Repo - Search Ingredients
  const result = await ingredientRepo.searchIngredients(index);
  return result;
}