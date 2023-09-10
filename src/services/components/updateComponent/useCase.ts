import { IComponent, IComponentData, IComponentIngredientData, IComponentIngredientDataArray, IComponentUpdateData, IMealComponentData } from '@lib/interfaces';
import ComponentRepository from '@lib/repositories/componentRepository';
import IngredientRepository from '@lib/repositories/ingredientRepository';
import { capitalizeFirstLetter } from 'src/utils/stringUtils';



export async function updateComponent(
  data: IComponentUpdateData
): Promise<any> {
  const componentRepo = ComponentRepository.getInstance();

  const componentData = {
    ...data,
    name: capitalizeFirstLetter(data.name),
  };

  const id = data.id;

  // Repo - Update Ingredient
  const result = await componentRepo.updateComponent(id, componentData);
  return result;
}


export async function updateComponentInComponentIngredient(
  component: IComponentUpdateData,
  ingredients: IComponentIngredientDataArray[],
): Promise<any> {
  const componentRepo = ComponentRepository.getInstance();

  const componentId = component.id

  // Repo - Create ComponentIngredient
  for (const ingredient of ingredients) {
    let data = {
      // name: component.name,
      // unit: component.unit,
      component_id: componentId,
      ingredient_id: ingredient.ingredient_id,
      ingredient_quantity: ingredient.ingredient_quantity 
    }
  await componentRepo.updateComponentInComponentIngredient(componentId,data);
  }
}


