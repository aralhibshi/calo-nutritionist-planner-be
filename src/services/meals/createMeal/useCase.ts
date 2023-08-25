import MealRepository from '@lib/repositories/mealRepository';
import { IMealCreateEvent, IMealData } from '@lib/interfaces';
import { capitalizeFirstLetter } from 'src/utils/stringUtils';

export async function createMeal(event: IMealCreateEvent): Promise<any> {
  const mealRepo = MealRepository.getInstance();

  const mealData: IMealData = {
    ...event.body,
    name: capitalizeFirstLetter(event.body.name),
    size: capitalizeFirstLetter(event.body.size),
  };
  delete mealData.components;

  // Repo - Create Meal
  const result = await mealRepo.createMeal(mealData);
  const mealId = result.body.data.id
  return {
    statusCode: 201,
    body: JSON.stringify({
      success: {
        title: 'Success',
        message: 'Component created successfully'
      },
      data: {
        id: mealId,
        ...mealData,
      }
    })
  }
}

export async function createMealComponent(
  meal: any,
  event: IMealCreateEvent
  ): Promise<any> {
  const mealRepo = MealRepository.getInstance();

  const components = event.body.components
  const parsedResult = JSON.parse(meal.body)
  const mealId = parsedResult.data.id;

  // Repo - Create Meal Component
  for (const component of components) {
    let data = {
      mealId: mealId,
      componentId: component.componentId,
      componentQuantity: component.component_quantity
    }
    await mealRepo.createMealComponent(data);
  }
}