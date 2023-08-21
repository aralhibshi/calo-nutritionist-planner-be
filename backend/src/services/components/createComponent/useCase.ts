import ComponentRepository from '@lib/repositories/componentRepository';
import { PrismaClient } from '@prisma/client';
import { Ingredients } from '@lib/repositories/componentRepository';
import createError from 'http-errors';

export async function createComponent(
  prisma: PrismaClient,
  componentData: any,
): Promise<any> {
  const componentRepo = new ComponentRepository(prisma);

  try {
    // Repo - Create Component
    const result = await componentRepo.createComponent(componentData);
    const componentId = result.body.data.id;
    return {
      statusCode: 201,
      body: JSON.stringify({
        success: {
          title: 'Success',
          message: 'Component created successfully'
        },
        data: {
          id: componentId,
          ...componentData,
        }
      })
    }
  } catch (err) {
    console.log('Error:', err);
    throw createError(500, 'Internal Server Error', {
      details: 'An error occurred while creating the component.',
    });
  }
}

export async function createComponentIngredient(
  prisma: PrismaClient,
  componentId: string,
  ingredients: Array<Ingredients>
  ):Promise<any> {
  const componentRepo = new ComponentRepository(prisma);

  try {
     // Repo - Create ComponentIngredient
    for (const ingredient of ingredients) {
      let data = {
        componentId: componentId,
        ingredientId: ingredient.ingredientId,
        ingredientQuantity: ingredient.ingredient_quantity 
      }
      await componentRepo.createComponentIngredient(data);
    }
  } catch (err) {
    console.log('Error:', err);
    throw createError(500, 'Internal Server Error', {
      details: 'An error occurred while creating the ComponentIngredient.',
    });
  }
}