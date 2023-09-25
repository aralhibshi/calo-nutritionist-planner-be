import { IIngredientUpdateData } from '@lib/interfaces';
import IngredientRepository from '@lib/repositories/ingredientRepository';
import { capitalizeFirstLetter } from 'src/utils/stringUtils';

export async function updateIngredient(
  data: IIngredientUpdateData
): Promise<any> {
  const ingredientRepo = IngredientRepository.getInstance();

  const updateData = {
    ...data,
    name: capitalizeFirstLetter(data.name),
  };

  // Repo - Update Ingredient
  const result = await ingredientRepo.update(updateData)
  return result;
}