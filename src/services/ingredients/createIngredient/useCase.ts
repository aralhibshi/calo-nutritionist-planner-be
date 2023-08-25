import { IIngredientCreateEvent } from '@lib/interfaces';
import IngredientRepository from '@lib/repositories/ingredientRepository';
import { capitalizeFirstLetter } from 'src/utils/stringUtils';

export async function createIngredient(
  event: IIngredientCreateEvent
): Promise<any> {
  const ingredientRepo = IngredientRepository.getInstance();

  const ingredientData = {
    ...event.body,
    name: capitalizeFirstLetter(event.body.name)
  }

  // Repo - Create Ingredient
  const result = await ingredientRepo.createIngredient(ingredientData);
  return result;
}