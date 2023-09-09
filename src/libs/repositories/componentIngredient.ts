import { Prisma, PrismaClient } from '@prisma/client';
import prisma from '@lib/prismaClient';
import { Component } from '@lib/interfaces/entities';
import createError from 'http-errors';

import { RestrictedBaseRepo } from './baseRepository';

export default class ComponentIngredientRepository extends RestrictedBaseRepo<Component> {
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