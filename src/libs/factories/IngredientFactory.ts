import { Ingredient } from "@lib/interfaces/entities";

export class IngredientFactory {
  public static create(params: Ingredient): Ingredient {
    const { name, category, description, price, protein, carbs, fats, unit } = params;
    return { name, category, description, price, protein, carbs, fats, unit };
  }
}
