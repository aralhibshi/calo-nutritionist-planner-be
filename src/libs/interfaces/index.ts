import { Decimal } from '@prisma/client/runtime/library';
import { APIGatewayProxyEvent } from 'aws-lambda';

// General ---

// Types -

// Get (All) - Event
export type TGetEvent = APIGatewayProxyEvent;


// Interfaces -

// Specific ---

// Interfaces -

// Ingredient
export interface IIngredient {
  // id: string;
  name: string;
  category?: string | null;
  description?: string | null;
  price: number;
  protein: number;
  fats: number;
  carbs: number;
  unit: string;
}

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

// Ingredient Update - Data
export interface IIngredientUpdateData {
  id: string;
  name: string;
  category?: string | null;
  description?: string | null;
  price: number;
  protein: number;
  fats: number;
  carbs: number;
  unit: string;
}

// Ingredient Get - Event
export interface IIngredientGetEvent {
  queryStringParameters: {
    skip: number;
    take: number;
    name?: string;
  }
}

// Ingredient Get - Data
export interface IIngredientGetData {
  skip: number;
  take: number;
  name?: string;
}

// Ingredient Get (Search) - Event
export interface IIngredientSearchEvent {
  queryStringParameters: {
    name: string;
    skip: number;
  };
}
// Ingredient Get (Search) - Data
export interface IIngredientSearchData {
  name: string;
  skip: number;
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

// Ingredient Delete - Event
export interface IIngredientDeleteEvent {
  queryStringParameters: {
    id: string;
  };
}

// Ingredient Delete - Data
export interface IIngredientDeleteData {
  id: string;
  IngredientComponent?: string | null;
}

// Component
export interface IComponent {
  id: string;
  name: string;
  category: string | null;
  description: string | null;
  unit: string;
  created_at: Date;
  updated_at: Date;
}

// Component Create - Event
export interface IComponentCreateEvent {
  body: {
    ingredients: Array<IComponentIngredientDataArray>;
    name: string;
    category?: string;
    description?: string;
    unit: string;
  }
}

// Component Create - Data
export interface IComponentData {
  name: string;
  category?: string;
  description?: string;
  unit: string;
}


// Ingredient Update - Event
export interface IComponentUpdateEvent {
  queryStringParameters: {
    id: string;
  };
  body: {
    ingredients:IComponentIngredientDataArray[];
    id: string;
    name: string;
    category?: string;
    description?: string;
    unit: string;
  };
}
// component Update - Data
export interface IComponentUpdateData {
  ingredients:IComponentIngredientDataArray[];
  id: string;
  name: string;
  category?: string;
  description?: string;
  unit: string;
}

// IComponentIngredient
export interface IComponentIngredient {
  id: string;
  component_id: string;
  ingredient_id: string;
  ingredient_quantity: number;
  created_at: Date;
  updated_at: Date;
}

export interface IComponentIngredientUpdateEvent {
  queryStringParameters: {
    id: string;
  };
  body: {
    component_id: string,
    ingredient_id: string,
    ingredient_quantity: number
  };
}
// ComponentIngredient Create - Data
export interface IComponentIngredientData {
  component_id: string,
  ingredient_id: string,
  ingredient_quantity: number
}

// ComponentIngredient Create (Ingredient Array) - Data
export interface IComponentIngredientDataArray {
  ingredient_id: string,
  ingredient_quantity: number
}

// Compnent Get - Event
export interface IComponentGetEvent {
  queryStringParameters: {
    skip: number;
    take: number;
    name?: string;
    ingredient_id?: string;
  };
}

// Component Get
export interface IComponentGetData {
  skip: number;
  take: number;
  name?: string;
  ingredient_id?: string;
}

// Component Get (Search) - Event
export interface IComponentSearchEvent {
  queryStringParameters: {
    name: string;
    skip: number
  };
}

// Component Get (Search)
export interface IComponentSearchData {
  name: string;
  skip: number
}

// Component Delete - Event
export interface IComponentDeleteEvent {
  queryStringParameters: {
    id: string;
  };
}

// Component Delete - Data
export interface IComponentDeleteData {
  id: string;
  component_id?: string | null;
}

// Component Create - Event
export interface IMealCreateEvent {
  body: {
    components: Array<IMealComponentDataArray>;
    id:string
    name: string;
    unit: string;
    size: string;
  }
}

// Meal
export interface IMeal {
  id: string;
  name: string;
  description: string | null;
  size: string;
  unit: string;
  created_at: Date;
  updated_at: Date;
}

// Meal Create/Update - Data
export interface IMealData {
  id : string
  name: string;
  description?: string;
  unit: string;
  size: string;
}

// MealComponent Create - Data
export interface IMealComponentData {
  meal_id: string;
  component_id: string;
  component_quantity: number;
}

// MealComponent Create (Component Array) - Data
export interface IMealComponentDataArray {
  component_id: string,
  component_quantity: number
}

// Meal Update - Event
export interface IMealUpdateEvent {
  queryStringParameters: {
    id: string;
  };
  body: {
    components: IMealComponentDataArray[];
    id: string;
    name: string;
    category?: string;
    description?: string;
    unit: string;
    size: string;
  };
}

// Meal Update - Data
export interface IMealUpdateData {
  components?: IMealComponentDataArray[]
  id: string;
  name: string;
  description?: string;
  size: string;
  unit: string;
}

// component Update - Data
export interface IComponentUpdateData {
  ingredients:IComponentIngredientDataArray[];
  id: string;
  name: string;
  category?: string;
  description?: string;
  unit: string;
}

// Meal Get - Event
export interface IMealGetEvent {
  queryStringParameters: {
    skip: number;
    take: number;
    name?: string,
    ingredient_id?: string;
    component_id?: string;
  }
}

// Meal Get - Data
export interface IMealGetData {
  skip: number;
  take: number;
  name?: string,
  ingredient_id?: string;
  component_id?: string;
}

// Meal Get (Search) - Event
export interface IMealSearchEvent {
  queryStringParameters: {
    name: string;
    skip: number
  };
}

// Meal Get (Search) - Data
export interface IMealSearchData {
  name: string;
  skip: number
}

// Meal Delete - Event
export interface IMealDeleteEvent {
  queryStringParameters: {
    id: string;
  };
}

// Meal Delete - Data
export interface IMealDeleteData {
  id: string;
  meal_id?: string | null;
}