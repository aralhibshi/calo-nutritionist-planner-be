import { IIngredient } from '@lib/interfaces';
import IngredientRepository from '@lib/repositories/ingredientRepository';
import { capitalizeFirstLetter } from 'src/utils/stringUtils';

export async function createIngredient(
  ingredientData: IIngredient
): Promise<IIngredient> {
  const ingredientRepo = IngredientRepository.getInstance();

  const data: IIngredient = {
    ...ingredientData,
    name: capitalizeFirstLetter(ingredientData.name)
  }

  // Repo - Create Ingredient
  const result = await ingredientRepo.create(data);
  return result;
}