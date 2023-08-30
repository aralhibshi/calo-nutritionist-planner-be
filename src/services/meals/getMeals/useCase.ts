import { IMealGetEvent } from "@lib/interfaces";
import MealRepository from "@lib/repositories/mealRepository";

export async function getMeals(
  event: IMealGetEvent
): Promise<any> {
  const mealRepo = MealRepository.getInstance();

  const skip = Number(event.queryStringParameters.skip);
  const take = Number(event.queryStringParameters.take);

  // Repo - Get Meals
  const result = await mealRepo.getMeals(skip, take);
  return result;
}