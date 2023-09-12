import { IIngredientDeleteData } from '@lib/interfaces';
import IngredientRepository from '@lib/repositories/ingredientRepository';
import ComponentIngredientRepository from '@lib/repositories/componentIngredient';

export async function removeIngredientFromComponentIngredient<T>(
  data: IIngredientDeleteData,
): Promise<any> {
  const componentIngredientRepo = ComponentIngredientRepository.getInstance();

  data.IngredientComponent = data.id

  // Repo - Remove Component from Meal Component
  const result = await componentIngredientRepo.delete(data);
  return result;
}

export async function deleteIngredient(
  data: IIngredientDeleteData
): Promise<any> {
  const ingredientRepo = IngredientRepository.getInstance();

  const id = data.id
  
  // Repo - Delete Ingredient
  const result = await ingredientRepo.delete(id);
  return result;
}