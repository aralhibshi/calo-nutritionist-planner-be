import { Prisma, PrismaClient } from '@prisma/client';
import prisma from '@lib/prismaClient';

export default class BaseRepo<T> {
  protected prisma: PrismaClient;
  protected model: Prisma.ModelName;

  constructor(model: Prisma.ModelName) {
    this.prisma = prisma;
    this.model = model;
  }
}