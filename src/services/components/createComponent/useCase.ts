import { IComponent, IComponentData, IComponentIngredientDataArray } from '@lib/interfaces';
import { Component } from '@lib/interfaces/entities';
import ComponentRepository from '@lib/repositories/componentRepository';
import ComponentIngredientRepository from '@lib/repositories/componentIngredient';
import { capitalizeFirstLetter } from 'src/utils/stringUtils';

export async function createComponent(
  componentData: Component
): Promise<Component> {
  const componentRepo = ComponentRepository.getInstance();

  const data: IComponentData = {
    ...componentData,
    name: capitalizeFirstLetter(componentData.name)
  };

  // Repo - Create Component
  const result = await componentRepo.create(data);
  return result;
}

export async function createComponentIngredient(
  component: IComponent,
  ingredients: IComponentIngredientDataArray[],
):Promise<any> {
  const componenIngredientRepo = ComponentIngredientRepository.getInstance();

  const componentId = component.id;

  // Repo - Create ComponentIngredient
  for (const ingredient of ingredients) {
    let data = {
      component_id: componentId,
      ingredient_id: ingredient.ingredient_id,
      ingredient_quantity: ingredient.ingredient_quantity 
    }


    await componenIngredientRepo.createJoin(data)

    await componenIngredientRepo.createJoin(
      data.component_id,
      data.ingredient_id,
      data.ingredient_quantity
      );
  }
}