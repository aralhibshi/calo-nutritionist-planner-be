import { IMealGetData } from "@lib/interfaces";
import MealRepository from "@lib/repositories/mealRepository";

export async function getMeals(
  data: IMealGetData
): Promise<any> {
  const mealRepo = MealRepository.getInstance();

  const skip = Number(data.skip);

  // Repo - Get Meals
  const result = await mealRepo.getMeals(skip);
  return result;
}