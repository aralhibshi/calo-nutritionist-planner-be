import { IIngredientGetData, IIngredientGetEvent } from '@lib/interfaces';
import IngredientRepository from '@lib/repositories/ingredientRepository';

export async function getIngredients(
  data: IIngredientGetData
): Promise<any> {
  const ingredientRepo = IngredientRepository.getInstance();

  const skip = Number(data.skip);
  const take = Number(data.take);

  // Repo - Get Ingredients
  const result = await ingredientRepo.getIngredients(skip, take);

  console.log('Ingredients fetched successfully');
  return result;
}