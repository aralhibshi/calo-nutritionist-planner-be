import ComponentRepository from '@lib/repositories/componentRepository';

export async function getComponents(
): Promise<any> {
  const componentRepo = ComponentRepository.getInstance();

  // Repo - Get Components
  const result = await componentRepo.getComponents();
  return result;
}