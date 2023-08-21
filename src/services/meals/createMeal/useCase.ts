import MealRepository from '@lib/repositories/mealRepository';
import { Components } from '@lib/repositories/mealRepository';
import { CreateMealInput } from '@lib/repositories/mealRepository';
import { PrismaClient } from '@prisma/client';
import createError from 'http-errors';

export async function createMeal(
  prisma: PrismaClient,
  mealData: CreateMealInput
): Promise<any> {
  const mealRepo = new MealRepository(prisma);

  try {
    // Repo - Create Meal
    const result = await mealRepo.createMeal(mealData);
    const mealId = result.body.data.id
    return {
      statusCode: 201,
      body: JSON.stringify({
        success: {
          title: 'Success',
          message: 'Component created successfully'
        },
        data: {
          id: mealId,
          ...mealData,
        }
      })
    }
  } catch (err) {
    console.log('Error:', err);
    throw createError(500, 'Internal Server Error', {
      details: 'An error occurred while creating the meal.',
    });
  }
}

export async function createMealComponent(
  prisma: PrismaClient,
  mealId: string,
  components: Array<Components>
): Promise<any> {
  const mealRepo = new MealRepository(prisma);

  try {
    // Repo - Create Meal Component
    for (const component of components) {
      let data = {
        mealId: mealId,
        componentId: component.componentId,
        componentQuantity: component.component_quantity
      }
      await mealRepo.createMealComponent(data);
    }
  } catch (err) {
    console.log('Error:', err);
    throw createError(500, 'Internal Server Error', {
      details: 'An error occurred while creating the MealComponent.',
    });
  }
}