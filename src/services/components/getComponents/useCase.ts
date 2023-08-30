
import { IComponentGetEvent } from '@lib/interfaces';
import ComponentRepository from '@lib/repositories/componentRepository';

export async function getComponents(
  event: IComponentGetEvent
): Promise<any> {
  const componentRepo = ComponentRepository.getInstance();

  const skip = Number(event.queryStringParameters.skip);

  // Repo - Get Components
  const result = await componentRepo.getComponents(skip);
  return result;
}