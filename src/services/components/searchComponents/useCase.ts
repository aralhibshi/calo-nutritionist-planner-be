import { IComponentSearchData } from '@lib/interfaces';
import ComponentRepository from '@lib/repositories/componentRepository';
import { capitalizeFirstLetter } from 'src/utils/stringUtils';

export async function searchComponents(
  data: IComponentSearchData
): Promise<any> {
  const componentRepo = ComponentRepository.getInstance();

  const capitalizedIndex = capitalizeFirstLetter(data.name);
  const skip = Number(data.skip)

  // Repo - Search Components
  const result = await componentRepo.searchComponents(capitalizedIndex, skip);
  return result;
}