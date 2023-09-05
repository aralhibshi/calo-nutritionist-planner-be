import { IMealGetData } from "@lib/interfaces";
import MealRepository from "@lib/repositories/mealRepository";
import { capitalizeFirstLetter } from "src/utils/stringUtils";

export async function getMeals(
  data: IMealGetData
): Promise<any> {
  const mealRepo = MealRepository.getInstance();

  const skip = Number(data.skip);
  const take = Number(data.take);
  let name = data.name;
  const componentId = data.component_id

  if (name) {
    name = capitalizeFirstLetter(name)
  }

  // Repo - Get Meals
  const result = await mealRepo.getMeals(skip, take, name, componentId);
  return result;
}