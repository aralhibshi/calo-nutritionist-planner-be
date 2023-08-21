import { Prisma, PrismaClient } from '@prisma/client';
import createError from 'http-errors';

export interface CreateMealInput {
  name: string;
  category?: string;
  description?: string;
  unit: string;
  size: string;
}

export interface Components {
  componentId: string,
  component_quantity: number
}

interface CreateMealComponentInput {
  mealId: string;
  componentId: string;
  componentQuantity: number;
}

export default class MealRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createMeal(data: CreateMealInput): Promise<any> {
    try {
      console.log('Creating Meal with data:', JSON.stringify(data, null, 2));

      const createdMeal = await this.prisma.meal.create({ data });

      console.log('Meal created successfully');

      return {
        statusCode: 201,
        body: {
          success: {
            title: 'Success',
            message: 'Meal created successfully'
          },
          data: createdMeal
        }
      };
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        console.log('Conflict Error:', err);
        throw createError(409, 'Conflict Error', {
          details: 'Meal name already exists',
        });
      }

      console.log('Prisma Error:', err);
      throw createError(400, 'Prisma Error', {
        details: 'Error creating meal in Prisma',
      });
    }
  }

  async getMeals(): Promise<any> {
    try {
      console.log('Fetching meals');
  
      const result = await this.prisma.meal.findMany();
  
      console.log('Meals fetched successfully');
  
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: {
            title: 'Success',
            message: 'Meals fetched successfully'
          },
          data: result
        }),
      };
    } catch (err) {
      console.log('Prisma Error:', err)
      throw createError(400, 'Prisma Error', {
        details: 'Error fetching meals in Prisma',
      });
    }
  }

  async createMealComponent(data: CreateMealComponentInput): Promise<any> {
    try {
      console.log('Creating meal component with mealId:', data.mealId, 'and componentId:', data.componentId);
  
      const result = await this.prisma.mealComponent.create({
        data: {
          meal: { connect: { id: data.mealId } },
          component: { connect: { id: data.componentId } },
          component_quantity: data.componentQuantity
        },
      });
  
      console.log('Meal component created successfully');
  
      return {
        statusCode: 201,
        body: JSON.stringify({
          success: {
            title: 'Success',
            message: 'ComponentIngredient created successfully'
          },
          data: result
        })
      };
    } catch (err) {
      console.log('Prisma Error', err)
      throw createError(400, 'Prisma Error', {
        details: 'Error creating ComponentIngredient in Prisma',
      });
    }
  }

  async removeMealFomMealComponent(id: string): Promise<any> {
    try {
      console.log('Removing meal from MealComponent');
  
      const result = await this.prisma.mealComponent.deleteMany({
        where: {
          meal_id: {
            equals: id,
          }
        }
      });
  
      console.log('Meal removed from MealComponent successfully');
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: {
            title: 'Success',
            message: 'Meal removed from MealComponent successfully',
          }
        }),
        data: result
      };
    } catch (err) {
      console.log('Prisma Error', err)
      throw createError(400, 'Prisma Error', {
        details: 'Error removing meal from MealComponent in Prisma',
      });
    }
  }

  async deleteMeal(id: string): Promise<any> {
    try {
      console.log('Deleting Meal');
  
      const result = await this.prisma.meal.delete({
        where: {
          id: id,
        },
      });
  
      console.log('Meal deleted successfully');
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: {
            title: 'Success',
            message: 'Meal deleted successfully',
          },
          data: result
        })
      };
    } catch (err) {
      console.log('Prisma Error', err)
      throw createError(400, 'Prisma Error', {
        details: 'Error deleting meal in Prisma',
      });
    }
  }
}