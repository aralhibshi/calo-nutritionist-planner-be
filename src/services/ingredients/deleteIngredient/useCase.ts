import { PrismaClient } from '@prisma/client';
import IngredientRepository from '@lib/repositories/ingredientRepository';

export async function deleteIngredient(prisma: PrismaClient, event: any): Promise<any> {
  const ingredientRepo = new IngredientRepository(prisma);

  const id = event.queryStringParameters.id
  
  // Repo - Remove Ingredient from ComponentIngredient
  await ingredientRepo.removeIngredientFromComponentIngredient(id);

  // Repo - Delete Ingredient
  const result = await ingredientRepo.deleteIngredient(id);
  return result;
}