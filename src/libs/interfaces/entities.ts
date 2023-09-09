import { Decimal } from "@prisma/client/runtime/library";

// Ingredient
export interface Ingredient {
  id: string;
  name: string;
  category: string | null;
  description: string | null;
  price: Decimal;
  protein: Decimal;
  fats: Decimal;
  carbs: Decimal;
  unit: string;
}

// Component
export interface Component {
  name: string;
  category?: string;
  description?: string;
  unit: string;
}

// ComponentIngredient
export interface IComponentIngredient {
  ingredient_id: string,
  ingredient_quantity: number
}