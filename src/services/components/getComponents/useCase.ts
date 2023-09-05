
import { IComponentGetData } from '@lib/interfaces';
import ComponentRepository from '@lib/repositories/componentRepository';

export async function getComponents(
  data: IComponentGetData
): Promise<any> {
  const componentRepo = ComponentRepository.getInstance();

  const skip = Number(data.skip);
  const take = Number(data.take);
  const name = data.name;
  const ingredientId = data.ingredient_id;

  // Repo - Get Components
  const result = await componentRepo.getComponents(skip, take, name, ingredientId);
  return result;
}