import { IComponent, IComponentData, IComponentIngredientDataArray } from 'calo-nutritionist-planner/src/libs/interfaces';
import ComponentRepository from 'calo-nutritionist-planner/src/libs/repositories/componentRepository';
import { capitalizeFirstLetter } from 'calo-nutritionist-planner/src/utils/stringUtils';

export async function createComponent(
  componentData: IComponentData
): Promise<IComponent> {
  const componentRepo = ComponentRepository.getInstance();

  const data: IComponentData = {
    ...componentData,
    name: capitalizeFirstLetter(componentData.name)
  };

  // Repo - Create Component
  const result = await componentRepo.createComponent(data);

  return result;
}

export async function createComponentIngredient(
  component: IComponent,
  ingredients: IComponentIngredientDataArray[],
):Promise<any> {
  const componentRepo = ComponentRepository.getInstance();

  const componentId = component.id;

  // Repo - Create ComponentIngredient
  for (const ingredient of ingredients) {
    let data = {
      component_id: componentId,
      ingredient_id: ingredient.ingredient_id,
      ingredient_quantity: ingredient.ingredient_quantity 
    }
    await componentRepo.createComponentIngredient(data);
  }
}