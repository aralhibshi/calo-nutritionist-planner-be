import { IComponentUpdateData } from '@lib/interfaces';
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