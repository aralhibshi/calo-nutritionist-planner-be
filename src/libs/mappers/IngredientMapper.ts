import { Ingredient } from "@lib/interfaces/entities";
import { IIngredient } from "@lib/interfaces";
import { capitalizeFirstLetter } from "src/utils/stringUtils";

export class IngredientMapper {
  public static toDomain(raw: IIngredient): Ingredient {
    const { name: ingredientName, ...otherData } = raw;

    return {
      name: capitalizeFirstLetter(ingredientName),
      ...otherData,
    };
  }

  public static toDTO(ingredient: Ingredient): any {
    return ingredient;
  }

  public static toPersistent(ingredient: Ingredient): any {
    return ingredient;
  }
}
