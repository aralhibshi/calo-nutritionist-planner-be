import { IMealDeleteData, IMealDeleteEvent } from '@lib/interfaces';
import MealRepository from '@lib/repositories/mealRepository';
import MealComponentRepository from '@lib/repositories/mealComponentRepository';

export async function removeMealFomMealComponent(
  data: IMealDeleteData
): Promise<any> {
  const mealComponentRepo = MealComponentRepository.getInstance();

  data.meal_id = data.id

  // Repo - Remove Meal From Meal Component
  const result = mealComponentRepo.delete(data);
  return result;
}

export async function deleteMeal(
  data: IMealDeleteData
): Promise<any> {
  const mealRepo = MealRepository.getInstance();

  const id = data.id;

  // Repo - Delete Meal
  const result = mealRepo.delete(id);
  return result;
}