import { IIngredientCreateEvent, IIngredientData } from '@lib/interfaces';
import IngredientRepository from '@lib/repositories/ingredientRepository';
import { capitalizeFirstLetter } from 'src/utils/stringUtils';

export async function createIngredient(
  ingredientData: IIngredientData
): Promise<any> {
  const ingredientRepo = IngredientRepository.getInstance();

  const data: IIngredientData = {
    ...ingredientData,
    name: capitalizeFirstLetter(ingredientData.name)
  }

  // Repo - Create Ingredient
  const result = await ingredientRepo.createIngredient(data);
  return result;
}