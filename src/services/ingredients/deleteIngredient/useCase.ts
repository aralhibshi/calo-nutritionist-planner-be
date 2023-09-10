import { IIngredientDeleteData } from '@lib/interfaces';
import IngredientRepository from '@lib/repositories/ingredientRepository';

export async function deleteIngredient(
  data: IIngredientDeleteData
): Promise<any> {
  const ingredientRepo = IngredientRepository.getInstance();

  const id = data.id
  
  // Repo - Remove Ingredient from ComponentIngredient
  await ingredientRepo.removeIngredientFromComponentIngredient(id);

  // Repo - Delete Ingredient
  const result = await ingredientRepo.deleteIngredient(id);
  return result;
}