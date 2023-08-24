import IngredientRepository from '@lib/repositories/ingredientRepository';

export async function getIngredients(): Promise<any> {
  const ingredientRepo = IngredientRepository.getInstance();

  // Repo - Get Ingredients
  const result = await ingredientRepo.getIngredients();

  console.log('Ingredients fetched successfully');
  return result;
}