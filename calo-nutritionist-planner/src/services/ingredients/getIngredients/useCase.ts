import { IIngredientGetData } from 'calo-nutritionist-planner/src/libs/interfaces';
import IngredientRepository from 'calo-nutritionist-planner/src/libs/repositories/ingredientRepository';
import { capitalizeFirstLetter } from 'calo-nutritionist-planner/src/utils/stringUtils';

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
  const result = await ingredientRepo.getIngredients(skip, take, name);
  return result;
}