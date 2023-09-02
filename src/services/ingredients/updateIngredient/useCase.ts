import { IIngredient, IIngredientUpdateEvent } from '@lib/interfaces';
import IngredientRepository from '@lib/repositories/ingredientRepository';
import { capitalizeFirstLetter } from 'src/utils/stringUtils';

export async function updateIngredient(
  data: IIngredient
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