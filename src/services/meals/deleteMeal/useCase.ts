import MealRepository from '@lib/repositories/mealRepository';
import { PrismaClient } from '@prisma/client';
import { removeComponentFomMealComponent } from 'src/services/components/deleteComponent/useCase';
import createError from 'http-errors';

export async function removeMealFomMealComponent(
  prisma: PrismaClient,
  id: string
): Promise<any> {
  const mealRepo = new MealRepository(prisma);

  try {
    // Repo - Remove Meal From Meal Component

    const result = mealRepo.removeMealFomMealComponent(id);
    return result;
  } catch (err) {
    console.log('Error:', err);
    throw createError(500, 'Internal Server Error', {
      details: 'An error occurred while removing the meal from MealComponent.',
    });
  }
}

export async function deleteMeal(
  prisma: PrismaClient,
  id: string
): Promise<any> {
  const mealRepo = new MealRepository(prisma);

  try {
    // Repo - Delete Meal
    const result = mealRepo.deleteMeal(id);
    return result;
  } catch (err) {
    console.log('Error:', err);
    throw createError(500, 'Internal Server Error', {
      details: 'An error occurred while deleting meal.',
    });
  }
}