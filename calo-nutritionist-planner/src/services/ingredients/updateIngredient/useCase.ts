import { IIngredientUpdateData } from 'calo-nutritionist-planner/src/libs/interfaces';
import IngredientRepository from 'calo-nutritionist-planner/src/libs/repositories/ingredientRepository';
import { capitalizeFirstLetter } from 'calo-nutritionist-planner/src/utils/stringUtils';

export async function updateIngredient(
  data: IIngredientUpdateData
): Promise<any> {
  const ingredientRepo = IngredientRepository.getInstance();

  const ingredientData = {
    ...data,
    name: capitalizeFirstLetter(data.name),
  };

  const id = data.id;

  // Repo - Update Ingredient
  const result = await ingredientRepo.updateIngredient(id, ingredientData);
  return result;
}