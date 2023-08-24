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