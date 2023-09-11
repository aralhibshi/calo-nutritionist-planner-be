// Ingredient
export interface Ingredient {
  id?: string;
  name: string;
  category?: string | null;
  description?: string | null;
  price: number;
  protein: number;
  fats: number;
  carbs: number;
  unit: string;
}

// Component
export interface Component {
  id?: string;
  name: string;
  category?: string;
  description?: string;
  unit: string;
}

// ComponentIngredient
export interface ComponentIngredient {
  id?: string;
  component_id: string;
  ingredient_id: string;
  ingredient_quantity: number;
}

// Meal
export interface Meal {
  id?: string;
  name: string;
  description?: string;
  size: string;
  unit: string;
}

// MealComponent
export interface MealComponent {
  id?: string;
  meal_id: string;
  component_id: string;
  component_quantity: number;
}