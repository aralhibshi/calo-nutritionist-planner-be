import { IIngredientSearchEvent } from '@lib/interfaces';
import IngredientRepository from '@lib/repositories/ingredientRepository';
import { capitalizeFirstLetter } from 'src/utils/stringUtils';

export async function searchIngredients(event: IIngredientSearchEvent): Promise<any> {
  const ingredientRepo = IngredientRepository.getInstance();

  const index = capitalizeFirstLetter(event.queryStringParameters.name);

  // Repo - Search Ingredients
  const result = await ingredientRepo.searchIngredients(index);
  return result;
}