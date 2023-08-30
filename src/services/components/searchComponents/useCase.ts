import { IComponentSearchEvent } from '@lib/interfaces';
import ComponentRepository from '@lib/repositories/componentRepository';
import { capitalizeFirstLetter } from 'src/utils/stringUtils';

export async function searchComponents(
  event: IComponentSearchEvent
): Promise<any> {
  const componentRepo = ComponentRepository.getInstance();

  const index = capitalizeFirstLetter(event.queryStringParameters.name);
  const skip = Number(event.queryStringParameters.skip);

  // Repo - Search Components
  const result = await componentRepo.searchComponents(index, skip);
  return result;
}