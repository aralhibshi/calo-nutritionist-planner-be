import { Prisma, PrismaClient } from '@prisma/client';
import createError from 'http-errors';

interface CreateIngredientInput {
  name: string;
  category?: string;
  description?: string;
  price: number;
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
  unit: string;
}

export default class IngredientRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createIngredient(data: CreateIngredientInput): Promise<any> {
    try {
      const protein = data.protein;
      const carbs = data.carbs;
      const fats = data.fats;
      const calories = (protein * 4) + (carbs * 4) + (fats * 9);

      const ingredientData = {
        ...data,
        calories: calories.toFixed(3),
      };

      const result = await this.prisma.ingredient.create({ data: ingredientData });

      console.log('Ingredient created successfully', result);

      return {
        statusCode: 201,
        body: JSON.stringify({
          success: {
            title: 'Success',
            message: 'Ingredient created successfully'
          },
          data: result
        })
      };
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        console.log('Conflict Error:', err);
        throw createError(409, 'Conflict Error', {
          details: 'Ingredient name already exists',
        });
      }

      console.log('Prisma Error:', err);
      throw createError(400, 'Prisma Error', {
        details: 'Error creating ingredient in Prisma',
      });
    }
  }

  async getIngredients(): Promise<any> {
    try {
      console.log('Fetching ingredients');

      const ingredients = await this.prisma.ingredient.findMany();

      console.log('Ingredients fetched successfully', ingredients);

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: {
            title: 'Success',
            message: 'Ingredients fetched successfully',
          },
          data: ingredients,
        }),
      };
    } catch (err) {
      console.log('Prisma Error:', err);
      throw createError(500, 'Prisma Error', {
        details: 'Error fetching ingredients in Prisma',
      });
    }
  }
}