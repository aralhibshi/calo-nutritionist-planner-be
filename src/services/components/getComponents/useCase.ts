import { IComponentGetData } from '@lib/interfaces';
import ComponentRepository from '@lib/repositories/componentRepository';
import { capitalizeFirstLetter } from 'src/utils/stringUtils';

export async function getComponents(
  data: IComponentGetData
): Promise<any> {
  const componentRepo = ComponentRepository.getInstance();

  const skip = Number(data.skip);
  const take = Number(data.take);
  let name = 'Hello';
  const ingredientId = data.ingredient_id;

  // if (name) {
  //   name = capitalizeFirstLetter(name)
  // }

  // Repo - Get Components
  const result = await componentRepo.getComponents(skip, take, name, ingredientId);
  return result;
}