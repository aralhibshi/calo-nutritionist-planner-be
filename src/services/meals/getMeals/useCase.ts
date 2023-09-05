import { IMealGetData } from "@lib/interfaces";
import MealRepository from "@lib/repositories/mealRepository";

export async function getMeals(
  data: IMealGetData
): Promise<any> {
  const mealRepo = MealRepository.getInstance();

  const skip = Number(data.skip);
  const take = Number(data.take);
  const name = data.name;
  const componentId = data.component_id

  // Repo - Get Meals
  const result = await mealRepo.getMeals(skip, take, name, componentId);
  return result;
}