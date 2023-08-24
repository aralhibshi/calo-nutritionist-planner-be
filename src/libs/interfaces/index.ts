// Ingredient Create - Event
export interface IIngredientCreateEvent {
  body: {
    name: string;
    category?: string;
    description?: string;
    price: number;
    protein: number;
    fats: number;
    carbs: number;
    unit: string;
  };
}

// Ingredient Create/Update - Data
export interface IIngredientData {
  name: string;
  category?: string;
  description?: string;
  price: number;
  protein: number;
  fats: number;
  carbs: number;
  unit: string;
}

// Ingredient Delete - Event
export interface IIngredientDeleteEvent {
  queryStringParameters: {
    id: string;
  };
}