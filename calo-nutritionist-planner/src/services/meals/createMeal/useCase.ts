import { IMeal, IMealComponentDataArray, IMealData } from 'calo-nutritionist-planner/src/libs/interfaces';
import MealRepository from 'calo-nutritionist-planner/src/libs/repositories/mealRepository';
import { capitalizeFirstLetter } from 'calo-nutritionist-planner/src/utils/stringUtils';

export async function createMeal(
  mealData: IMealData
): Promise<IMeal> {
  const mealRepo = MealRepository.getInstance();

  const data: IMealData = {
    ...mealData,
    name: capitalizeFirstLetter(mealData.name),
    size: capitalizeFirstLetter(mealData.size),
  };

  // Repo - Create Meal
  const result = await mealRepo.createMeal(data);

  return result;
}

export async function createMealComponent(
  meal: IMeal,
  components: IMealComponentDataArray[]
  ): Promise<any> {
  const mealRepo = MealRepository.getInstance();

  const mealId = meal.id;

  // Repo - Create Meal Component
  for (const component of components) {
    let data = {
      meal_id: mealId,
      component_id: component.component_id,
      component_quantity: component.component_quantity
    }
    await mealRepo.createMealComponent(data);
  }
}