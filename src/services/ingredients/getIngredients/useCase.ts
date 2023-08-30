import { IIngredientGetEvent } from '@lib/interfaces';
import IngredientRepository from '@lib/repositories/ingredientRepository';

export async function getIngredients(
  event: IIngredientGetEvent
): Promise<any> {
  const ingredientRepo = IngredientRepository.getInstance();

  const skip = Number(event.queryStringParameters.skip);
  const take = Number(event.queryStringParameters.take);

  // Repo - Get Ingredients
  const result = await ingredientRepo.getIngredients(skip, take);

  console.log('Ingredients fetched successfully');
  return result;
}