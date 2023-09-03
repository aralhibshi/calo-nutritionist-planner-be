
import { IComponentGetData } from '@lib/interfaces';
import ComponentRepository from '@lib/repositories/componentRepository';

export async function getComponents(
  data: IComponentGetData
): Promise<any> {
  const componentRepo = ComponentRepository.getInstance();

  const skip = Number(data.skip)

  // Repo - Get Components
  const result = await componentRepo.getComponents(skip);
  return result;
}