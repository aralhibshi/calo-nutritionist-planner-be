import { IMealSearchData } from "@lib/interfaces";
import MealRepository from "@lib/repositories/mealRepository";
import { capitalizeFirstLetter } from "src/utils/stringUtils";

export async function searchMeals(
  data: IMealSearchData
): Promise<any> {
  const mealRepo = MealRepository.getInstance();

  const capitalizedIndex = capitalizeFirstLetter(data.name);
  const skip = Number(data.skip)

  // Repo - Search Meals
  const result = await mealRepo.searchMeals(capitalizedIndex, skip);
  return result;
}