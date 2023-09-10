import { IComponentDeleteData, IComponentDeleteEvent } from 'calo-nutritionist-planner/src/libs/interfaces';
import ComponentRepository from 'calo-nutritionist-planner/src/libs/repositories/componentRepository';

export async function removeComponentFromComponentIngredient(
  data: IComponentDeleteData
): Promise<any> {
  const componentRepo = ComponentRepository.getInstance();

  const id = data.id;

  // Repo - Remove Component from Component Ingredient
  const result = await componentRepo.removeComponentFromComponentIngredient(id);
  return result;
}

export async function removeComponentFomMealComponent(
  data: IComponentDeleteData
): Promise<any> {
  const componentRepo = ComponentRepository.getInstance();

  const id = data.id;

  // Repo - Remove Component from Meal Component
  const result = await componentRepo.removeComponentFomMealComponent(id);
  return result;
}

export async function deleteComponent(
  data: IComponentDeleteData
): Promise<any> {
  const componentRepo = ComponentRepository.getInstance();

  const id = data.id;

  // Repo - Delete Component
  const result = await componentRepo.deleteComponent(id);
  return result;
}