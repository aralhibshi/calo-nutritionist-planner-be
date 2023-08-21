import ComponentRepository from '@lib/repositories/componentRepository';
import { PrismaClient } from '@prisma/client';
import createError from 'http-errors';

export async function searchComponents(
  prisma: PrismaClient,
  index: string
): Promise<any> {
  const componentRepo = new ComponentRepository(prisma);

  try {
    // Repo - Search Components
    const result = await componentRepo.searchComponents(index);
    return result;
  } catch (err) {
    console.log('Error:', err);
    throw createError(500, 'Internal Server Error', {
      details: 'An error occurred while fetching matching components.',
    });
  }
}