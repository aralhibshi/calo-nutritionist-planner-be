import { IIngredient, IIngredientData } from 'calo-nutritionist-planner/src/libs/interfaces';
import IngredientRepository from 'calo-nutritionist-planner/src/libs/repositories/ingredientRepository';
import { capitalizeFirstLetter } from 'calo-nutritionist-planner/src/utils/stringUtils';

export async function createIngredient(
  ingredientData: IIngredientData
): Promise<IIngredient> {
  const ingredientRepo = IngredientRepository.getInstance();

  const data: IIngredientData = {
    ...ingredientData,
    name: capitalizeFirstLetter(ingredientData.name)
  }

  // Repo - Create Ingredient
  const result = await ingredientRepo.createIngredient(data);
  return result;
}