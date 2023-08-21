import MealRepository from "@lib/repositories/mealRepository";
import { PrismaClient } from "@prisma/client";
import createError from 'http-errors';

export async function getMeals(
  prisma: PrismaClient
): Promise<any> {
  const mealRepo = new MealRepository(prisma);

  try {
    // Repo - Get Meals
    const result = await mealRepo.getMeals();
    return result;
  } catch (err) {
    console.log('Error:', err);
    throw createError(500, 'Internal Server Error', {
      details: 'An error occurred while fetching meals.',
    });
  }
}