import { IComponentDeleteEvent } from '@lib/interfaces';
import ComponentRepository from '@lib/repositories/componentRepository';

export async function removeComponentFromComponentIngredient(event: IComponentDeleteEvent
): Promise<any> {
  const componentRepo = ComponentRepository.getInstance();

  const id = event.queryStringParameters.id;

  // Repo - Remove Component from Component Ingredient
  const result = await componentRepo.removeComponentFromComponentIngredient(id);
  return result;
}

export async function removeComponentFomMealComponent(event: IComponentDeleteEvent): Promise<any> {
  const componentRepo = ComponentRepository.getInstance();

  const id = event.queryStringParameters.id;

  // Repo - Remove Component from Meal Component
  const result = await componentRepo.removeComponentFomMealComponent(id);
  return result;
}

export async function deleteComponent(event: IComponentDeleteEvent
  ): Promise<any> {
  const componentRepo = ComponentRepository.getInstance();

  const id = event.queryStringParameters.id;

  // Repo - Delete Component
  const result = await componentRepo.deleteComponent(id);
  return result;
}