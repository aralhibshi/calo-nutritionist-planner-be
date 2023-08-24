import { PrismaClient } from '@prisma/client';
import { IComponentCreateEvent, IComponentData } from '@lib/interfaces';
import ComponentRepository from '@lib/repositories/componentRepository';
import { capitalizeFirstLetter } from 'src/utils/stringUtils';

export async function createComponent(
  prisma: PrismaClient,
  event: IComponentCreateEvent,
  ): Promise<any> {
  const componentRepo = ComponentRepository.getInstance(prisma);

  const componentData: IComponentData = {
    ...event.body,
    name: capitalizeFirstLetter(event.body.name)
  };

  delete componentData.ingredients;

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
}

export async function createComponentIngredient(
  prisma: PrismaClient,
  component: any,
  event: IComponentCreateEvent,
  ):Promise<any> {
  const componentRepo = ComponentRepository.getInstance(prisma);

  const ingredients = event.body.ingredients
  const parsedResult = JSON.parse(component.body)
  const componentId = parsedResult.data.id;

  // Repo - Create ComponentIngredient
  for (const ingredient of ingredients) {
    let data = {
      componentId: componentId,
      ingredientId: ingredient.ingredientId,
      ingredientQuantity: ingredient.ingredient_quantity 
    }
    await componentRepo.createComponentIngredient(data);
  }
}