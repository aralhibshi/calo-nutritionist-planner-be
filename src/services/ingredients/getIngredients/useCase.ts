import { IIngredientGetData } from '@lib/interfaces';
import IngredientRepository from '@lib/repositories/ingredientRepository';
import { capitalizeFirstLetter } from 'src/utils/stringUtils';

export async function getIngredients(
  data: IIngredientGetData
): Promise<any> {
  const ingredientRepo = IngredientRepository.getInstance();

  const skip = Number(data.skip);
  const take = Number(data.take);
  let name = data.name

  if (name) {
    name = capitalizeFirstLetter(name)
  }

  // Repo - Get Ingredients
  const result = await ingredientRepo.get(skip, take, name);
  return result;
}