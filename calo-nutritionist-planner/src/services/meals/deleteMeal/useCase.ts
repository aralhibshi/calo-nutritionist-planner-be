import { IMealDeleteData, IMealDeleteEvent } from 'calo-nutritionist-planner/src/libs/interfaces';
import MealRepository from 'calo-nutritionist-planner/src/libs/repositories/mealRepository';

export async function removeMealFomMealComponent(
  data: IMealDeleteData
): Promise<any> {
  const mealRepo = MealRepository.getInstance();

  const id = data.id;

  // Repo - Remove Meal From Meal Component
  const result = mealRepo.removeMealFomMealComponent(id);
  return result;
}

export async function deleteMeal(
  data: IMealDeleteData
): Promise<any> {
  const mealRepo = MealRepository.getInstance();

  const id = data.id;

  // Repo - Delete Meal
  const result = mealRepo.deleteMeal(id);
  return result;
}