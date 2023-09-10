import { IMealGetData } from "calo-nutritionist-planner/src/libs/interfaces";
import MealRepository from "calo-nutritionist-planner/src/libs/repositories/mealRepository";
import { capitalizeFirstLetter } from "calo-nutritionist-planner/src/utils/stringUtils";

export async function getMeals(
  data: IMealGetData
): Promise<any> {
  const mealRepo = MealRepository.getInstance();

  const skip = Number(data.skip);
  const take = Number(data.take);
  let name = data.name;
  const ingredient_id = data.ingredient_id;
  const componentId = data.component_id;

  if (name) {
    name = capitalizeFirstLetter(name)
  }

  // Repo - Get Meals
  const result = await mealRepo.getMeals(skip, take, name, ingredient_id, componentId);
  return result;
}