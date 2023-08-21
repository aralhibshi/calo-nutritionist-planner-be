import ComponentRepository from '@lib/repositories/componentRepository';
import { PrismaClient } from '@prisma/client';
import createError from 'http-errors';

export async function getComponents(
  prisma: PrismaClient
  ): Promise<any> {
  const componentRepo = new ComponentRepository(prisma);

  try {
    // Repo - Get Components
    const result = await componentRepo.getComponents();
    return result;
  } catch (err) {
    console.log('Error:', err);
    throw createError(500, 'Internal Server Error', {
      details: 'An error occurred while fetching components.',
    });
  }
}