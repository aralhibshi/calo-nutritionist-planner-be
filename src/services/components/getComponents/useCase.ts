
import { IComponentGet } from '@lib/interfaces';
import ComponentRepository from '@lib/repositories/componentRepository';

export async function getComponents(
  skip: number
): Promise<any> {
  const componentRepo = ComponentRepository.getInstance();

  // Repo - Get Components
  const result = await componentRepo.getComponents(skip);
  return result;
}