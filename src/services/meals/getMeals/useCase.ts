import MealRepository from "@lib/repositories/mealRepository";

export async function getMeals(
): Promise<any> {
  const mealRepo = MealRepository.getInstance();

  // Repo - Get Meals
  const result = await mealRepo.getMeals();
  return result;
}