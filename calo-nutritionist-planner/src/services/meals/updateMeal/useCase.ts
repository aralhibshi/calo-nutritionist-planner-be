import { IMeal, IMealComponentDataArray, IMealUpdateData } from "calo-nutritionist-planner/src/libs/interfaces";
import MealRepository from "calo-nutritionist-planner/src/libs/repositories/mealRepository";
import { capitalizeFirstLetter } from "calo-nutritionist-planner/src/utils/stringUtils";

export async function updateMeal(
  data: IMealUpdateData
): Promise<any> {
  const mealRepo = MealRepository.getInstance();

  const mealData = {
    ...data,
    name: capitalizeFirstLetter(data.name)
  }

  const id = data.id;
  delete mealData.components;

  // Repo - Update Meal
  const result = await mealRepo.updateMeal(id, mealData);
  return result;
}

export async function updateMealComponent(
  meal: IMealUpdateData,
  components: IMealComponentDataArray[]
): Promise<any> {
  const mealRepo = MealRepository.getInstance();

  const mealId = meal.id

  // Repo - Update MealComponent
  for (const component of components) {
    let data = {
      meal_id: mealId,
      component_id: component.component_id,
      component_quantity: component.component_quantity
    }
    await mealRepo.updateMealComponent(mealId, data)
  }
}