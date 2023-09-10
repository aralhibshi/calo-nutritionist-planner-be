import { IComponentGetData } from 'calo-nutritionist-planner/src/libs/interfaces';
import ComponentRepository from 'calo-nutritionist-planner/src/libs/repositories/componentRepository';
import { capitalizeFirstLetter } from 'calo-nutritionist-planner/src/utils/stringUtils';

export async function getComponents(
  data: IComponentGetData
): Promise<any> {
  const componentRepo = ComponentRepository.getInstance();

  const skip = Number(data.skip);
  const take = Number(data.take);
  let name = data.name;
  const ingredientId = data.ingredient_id;

  if (name) {
    name = capitalizeFirstLetter(name)
  }

  // Repo - Get Components
  const result = await componentRepo.getComponents(skip, take, name, ingredientId);
  return result;
}