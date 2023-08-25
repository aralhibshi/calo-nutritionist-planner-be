import { IIngredientUpdateEvent } from '@lib/interfaces';
import IngredientRepository from '@lib/repositories/ingredientRepository';
import { capitalizeFirstLetter } from 'src/utils/stringUtils';

export async function updateIngredient(
  event: IIngredientUpdateEvent
): Promise<any> {
  const ingredientRepo = IngredientRepository.getInstance();

  const ingredientData = {
    ...event.body,
    name: capitalizeFirstLetter(event.body.name),
  };

  const id = capitalizeFirstLetter(event.queryStringParameters.id);

  // Repo - Update Ingredient
  const result = await ingredientRepo.updateIngredient(id, ingredientData);
  return result;
}