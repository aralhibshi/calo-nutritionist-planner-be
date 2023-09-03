import { IMealGetData } from "@lib/interfaces";
import MealRepository from "@lib/repositories/mealRepository";

export async function getMeals(
  data: IMealGetData
): Promise<any> {
  const mealRepo = MealRepository.getInstance();

  const skip = Number(data.skip);
  const take = Number(data.take);

  // Repo - Get Meals
  const result = await mealRepo.getMeals(skip, take);
  return result;
}