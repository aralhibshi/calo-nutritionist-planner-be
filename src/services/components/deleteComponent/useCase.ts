import ComponentRepository from '@lib/repositories/componentRepository';
import { PrismaClient } from '@prisma/client';
import createError from 'http-errors';

export async function removeComponentFromComponentIngredient(
  prisma: PrismaClient,
  id: string
): Promise<any> {
  const componentRepo = new ComponentRepository(prisma);

  try {
    // Repo - Remove Component from Component Ingredient
    const result = await componentRepo.removeComponentFromComponentIngredient(id);
    return result;
  } catch (err) {
    console.log('Error:', err);
    throw createError(500, 'Internal Server Error', {
      details: 'An error occurred while removing the component from ComponentIngredient.',
    });
  }
}

export async function removeComponentFomMealComponent(
  prisma: PrismaClient,
  id: string
  ): Promise<any> {
  const componentRepo = new ComponentRepository(prisma);

  try {
    // Repo - Remove Component from Meal Component
    const result = await componentRepo.removeComponentFomMealComponent(id);
    return result;
  } catch (err) {
    console.log('Error:', err);
    throw createError(500, 'Internal Server Error', {
      details: 'An error occurred while removing the component from MealComponent.',
    });
  }
}

export async function deleteComponent(
  prisma: PrismaClient,
  id: string
  ): Promise<any> {
  const componentRepo = new ComponentRepository(prisma);

  try {
    // Repo - Delete Component
    const result = await componentRepo.deleteComponent(id);
    return result;
  } catch (err) {
    console.log('Error:', err);
    throw createError(500, 'Internal Server Error', {
      details: 'An error occurred while deleting the component.',
    });
  }
}