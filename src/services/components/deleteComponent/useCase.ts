import { IComponentDeleteData } from '@lib/interfaces';
import ComponentIngredientRepository from '@lib/repositories/componentIngredient';
import ComponentRepository from '@lib/repositories/componentRepository';
import MealComponentRepository from '@lib/repositories/mealComponentRepository';

export async function removeComponentFromComponentIngredient(
  data: IComponentDeleteData
): Promise<any> {
  const componentIngredientRepo = ComponentIngredientRepository.getInstance();

  data.component_id = data.id;

  // Repo - Remove Component from Component Ingredient
  const result = await componentIngredientRepo.delete(data);
  return result;
}

export async function removeComponentFomMealComponent(
  data: IComponentDeleteData
): Promise<any> {
  const mealComponentRepository = MealComponentRepository.getInstance();

  data.component_id = data.id;

  // Repo - Remove Component from Meal Component
  const result = await mealComponentRepository.delete(data);
  return result;
}

export async function deleteComponent(
  data: IComponentDeleteData
): Promise<any> {
  const componentRepo = ComponentRepository.getInstance();

  const id = data.id;

  // Repo - Delete Component
  const result = await componentRepo.delete(id);
  return result;
}