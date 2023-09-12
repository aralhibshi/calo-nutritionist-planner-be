import { IMeal, IMealComponentDataArray, IMealUpdateData } from "@lib/interfaces";
import MealRepository from "@lib/repositories/mealRepository";
import MealComponentRepository from "@lib/repositories/mealComponentRepository";
import { capitalizeFirstLetter } from "src/utils/stringUtils";

export async function updateMealComponent(
  meal: IMealUpdateData,
  components: IMealComponentDataArray[]
): Promise<any> {
  const mealComponentRepo = MealComponentRepository.getInstance();

  const mealId = meal.id

  // Repo - Update MealComponent
  for (const component of components) {
    let data = {
      meal_id: mealId,
      component_id: component.component_id,
      component_quantity: component.component_quantity
    }
    await mealComponentRepo.update('component_id', data)
  }
}

export async function updateMeal(
  data: IMealUpdateData
): Promise<any> {
  const mealRepo = MealRepository.getInstance();

  const capitzaliedData = {
    ...data,
    name: capitalizeFirstLetter(data.name),
  };

  const {
    components,
    ...updateData
  } = capitzaliedData

  // Repo - Update Meal
  const result = await mealRepo.update(updateData);
  return result;
}