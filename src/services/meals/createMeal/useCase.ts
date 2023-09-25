import { Meal } from '@lib/interfaces/entities';
import { IMeal, IMealComponentDataArray, IMealData } from '@lib/interfaces';
import MealRepository from '@lib/repositories/mealRepository';
import MealComponentRepository from '@lib/repositories/mealComponentRepository';
import { capitalizeFirstLetter } from 'src/utils/stringUtils';

export async function createMeal(
  mealData: IMealData
): Promise<Meal> {
  const mealRepo = MealRepository.getInstance();

  const data: IMealData = {
    ...mealData,
    name: capitalizeFirstLetter(mealData.name),
    size: capitalizeFirstLetter(mealData.size),
  };

  // Repo - Create Meal
  const result = await mealRepo.create(data);
  return result;
}

export async function createMealComponent(
  meal: Meal,
  components: IMealComponentDataArray[]
  ): Promise<any> {
  const mealComponentRepo = MealComponentRepository.getInstance();

  const mealId = meal.id;

  // Repo - Create Meal Component
  for (const component of components) {
    let data = {
      meal_id: mealId,
      component_id: component.component_id,
      component_quantity: component.component_quantity
    }
    await mealComponentRepo.create(data);
  }
}