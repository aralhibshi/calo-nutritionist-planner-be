import { IIngredient } from "@lib/interfaces";
import { IngredientFactory } from "@lib/factories/IngredientFactory";
import { IngredientMapper } from "@lib/mappers/IngredientMapper";
import IngredientRepository from "@lib/repositories/ingredientRepository";

export async function createIngredient(ingredientData: IIngredient): Promise<IIngredient> {
  const ingredient = IngredientMapper.toDomain(ingredientData);
  const ingredientInstance = IngredientFactory.create(ingredient);
  const ingredientRepo = IngredientRepository.getInstance();

  const result = await ingredientRepo.create(ingredientInstance);
  const mappedResult = IngredientMapper.toDTO(result);

  return mappedResult;
}
