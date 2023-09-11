import { IComponent, IComponentData, IComponentIngredientData, IComponentIngredientDataArray, IComponentUpdateData, IMealComponentData } from '@lib/interfaces';
import ComponentRepository from '@lib/repositories/componentRepository';
import ComponentIngredientRepository from '@lib/repositories/componentIngredient';
import { capitalizeFirstLetter } from 'src/utils/stringUtils';



export async function updateComponent(
  data: IComponentUpdateData
): Promise<any> {
  const componentRepo = ComponentRepository.getInstance();

  const capitzaliedData = {
    ...data,
    name: capitalizeFirstLetter(data.name),
  };

  const {
    ingredients,
    ...updateData
  } = capitzaliedData

  // Repo - Update Ingredient
  const result = await componentRepo.update(updateData);
  return result;
}


export async function updateComponentInComponentIngredient(
  component: IComponentUpdateData,
  ingredients: IComponentIngredientDataArray[],
): Promise<any> {
  const componentIngredientRepo = ComponentIngredientRepository.getInstance();

  const componentId = component.id

  // Repo - Create ComponentIngredient
  for (const ingredient of ingredients) {
    let data = {
      component_id: componentId,
      ingredient_id: ingredient.ingredient_id,
      ingredient_quantity: ingredient.ingredient_quantity 
    }
  await componentIngredientRepo.update(data)
  }
}
