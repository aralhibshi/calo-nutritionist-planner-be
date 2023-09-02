import { IIngredientSearchData } from '@lib/interfaces';
import IngredientRepository from '@lib/repositories/ingredientRepository';
import { capitalizeFirstLetter } from 'src/utils/stringUtils';

export async function searchIngredients(
  data: IIngredientSearchData
): Promise<any> {
  const ingredientRepo = IngredientRepository.getInstance();

  const index = capitalizeFirstLetter(data.name);
  const skip = Number(data.skip);

  // Repo - Search Ingredients
  const result = await ingredientRepo.searchIngredients(index, skip);
  return result;
}