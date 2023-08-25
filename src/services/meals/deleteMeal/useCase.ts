import { IMealDeleteEvent } from '@lib/interfaces';
import MealRepository from '@lib/repositories/mealRepository';

export async function removeMealFomMealComponent(
  event: IMealDeleteEvent
): Promise<any> {
  const mealRepo = MealRepository.getInstance();

  const id = event.queryStringParameters.id;

  // Repo - Remove Meal From Meal Component
  const result = mealRepo.removeMealFomMealComponent(id);
  return result;
}

export async function deleteMeal(
  event: IMealDeleteEvent
): Promise<any> {
  const mealRepo = MealRepository.getInstance();

  const id = event.queryStringParameters.id;

  // Repo - Delete Meal
  const result = mealRepo.deleteMeal(id);
  return result;
}