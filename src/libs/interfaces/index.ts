import { APIGatewayProxyEvent } from 'aws-lambda';

// Types ---

// Ingredient Get (All) - Event
export type TIngredientGetEvent = APIGatewayProxyEvent;

// Interfaces ---

// Ingredient Create/Update - Event
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

// Ingredient Update - Event
export interface IIngredientUpdateEvent {
  queryStringParameters: {
    id: string;
  };
  body: {
    id: string;
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

// Ingredient Get (Search) - Event
export interface IIngredientSearchEvent {
  queryStringParameters: {
    name: string;
  };
}

// Ingredient Delete - Event
export interface IIngredientDeleteEvent {
  queryStringParameters: {
    id: string;
  };
}

// Component Create - Event
export interface IComponentCreateEvent {
  body: {
    ingredients: Array<IComponentIngredientDataArray>;
    name: string;
    unit: string;
  }
}

// Component Create/Update - Data
export interface IComponentData {
  name: string;
  category?: string;
  description?: string;
  ingredients?: Array<IComponentIngredientDataArray>
  unit: string;
}

// ComponentIngredient Create - Data
export interface IComponentIngredientData {
  componentId: string,
  ingredientId: string,
  ingredientQuantity: number
}

// ComponentIngredient Create (Ingredient Array) - Data
export interface IComponentIngredientDataArray {
  ingredientId: string,
  ingredient_quantity: number
}