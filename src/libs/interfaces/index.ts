import { APIGatewayProxyEvent } from 'aws-lambda';

// General ---

// Types -

// Ingredient Get (All) - Event
export type TGetEvent = APIGatewayProxyEvent;


// Interfaces -

// Ingredient Delete - Event
export interface IIngredientDeleteEvent {
  queryStringParameters: {
    id: string;
  };
}

// Specific ---

// Interfaces -

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

// Component Delete - Event
export interface IComponentDeleteEvent {
  queryStringParameters: {
    id: string;
  };
}

// Component Create - Event
export interface IMealCreateEvent {
  body: {
    components: Array<IMealComponentDataArray>;
    name: string;
    unit: string;
    size: string;
  }
}

// Meal Create/Update - Data
export interface IMealData {
  name: string;
  category?: string;
  description?: string;
  components?: Array<IMealComponentDataArray>;
  unit: string;
  size: string;
}

// MealComponent Create - Data
export interface IMealComponentData {
  mealId: string;
  componentId: string;
  componentQuantity: number;
}

// MealComponent Create (Component Array) - Data
export interface IMealComponentDataArray {
  componentId: string,
  component_quantity: number
}