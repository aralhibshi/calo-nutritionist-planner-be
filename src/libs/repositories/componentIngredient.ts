import { Prisma, PrismaClient } from '@prisma/client';
import prisma from '@lib/prismaClient';
import { ComponentIngredient } from '@lib/interfaces/entities';
import createError from 'http-errors';

import { JoinBaseRepo } from './base/joinBaseRepository';

export default class ComponentIngredientRepository extends JoinBaseRepo<ComponentIngredient> {
  private static instance: ComponentIngredientRepository | null = null;

  private constructor() {
    super('ComponentIngredient')
  }

  public static getInstance(): ComponentIngredientRepository {
    if (!ComponentIngredientRepository.instance) {
      ComponentIngredientRepository.instance = new ComponentIngredientRepository();
    }
    return ComponentIngredientRepository.instance;
  }
}