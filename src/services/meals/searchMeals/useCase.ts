import { IMealSearchEvent } from "@lib/interfaces";
import MealRepository from "@lib/repositories/mealRepository";
import { capitalizeFirstLetter } from "src/utils/stringUtils";

export async function searchMeals(
  event: IMealSearchEvent
): Promise<any> {
  const mealRepo = MealRepository.getInstance();

  const index = capitalizeFirstLetter(event.queryStringParameters.name);

  // Repo - Search Meals
  const result = await mealRepo.searchMeals(index);
  return result;
}