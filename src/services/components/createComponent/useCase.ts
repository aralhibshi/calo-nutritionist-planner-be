import { IComponent, IComponentData, IComponentIngredientDataArray } from '@lib/interfaces';
import ComponentRepository from '@lib/repositories/componentRepository';
import { capitalizeFirstLetter } from 'src/utils/stringUtils';

export async function createComponent(
  componentData: IComponentData
): Promise<IComponent> {
  const componentRepo = ComponentRepository.getInstance();

  const data: IComponentData = {
    ...componentData,
    name: capitalizeFirstLetter(componentData.name)
  };

  // delete componentData.ingredients;

  // Repo - Create Component
  const result = await componentRepo.createComponent(data);

  return result;
}

export async function createComponentIngredient(
  component: IComponent,
  componentIngredientData: IComponentIngredientDataArray[],
):Promise<any> {
  const componentRepo = ComponentRepository.getInstance();

  const ingredients = componentIngredientData
  const componentId = component.id;

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