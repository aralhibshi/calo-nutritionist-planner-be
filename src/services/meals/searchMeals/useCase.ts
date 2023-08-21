import MealRepository from "@lib/repositories/mealRepository";
import { PrismaClient } from "@prisma/client";
import createError from 'http-errors';

export async function searchMeals(
  prisma: PrismaClient,
  index: string
): Promise<any> {
  const mealRepo = new MealRepository(prisma);

  try {
    // Repo - Search Meals
    const result = await mealRepo.searchMeals(index);
    return result;
  } catch (err) {
    console.log('Error:', err);
    throw createError(500, 'Internal Server Error', {
      details: 'An error occurred while fetching matching meals.',
    });
  }
}