import { Prisma, PrismaClient } from '@prisma/client';
import prisma from '@lib/prismaClient';
import createError from 'http-errors';

export default class BaseRepo<T> {
  protected prisma: PrismaClient;
  protected model: Prisma.ModelName;

  constructor(model: Prisma.ModelName) {
    this.prisma = prisma;
    this.model = model;
  }

  protected async create(
    data: T
  ): Promise<T> {
    try {
      console.log(`Creating ${this.model} with data:`, JSON.stringify(data, null, 2));

      const result = await this.prisma[this.model].create({ data });
      return result as T;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        console.log('Conflict Error:', err);
        throw createError(409, 'Conflict Error', {
          details: `${this.model} name already exists`,
        });
      }

      console.log('Prisma Error:', err);
      throw createError(400, 'Prisma Error', {
        details: `Error creating ${this.model} in Prisma`,
      });
    }
  }
}

export class RestrictedBaseRepo<T> extends BaseRepo<T> {
  constructor(model: Prisma.ModelName) {
    super(model);
  }

  public async createJoin(
    data: T,
    id1: string,
    id2: string,
    quantity: number
  ): Promise<any> {
    try {
      console.log(`Creating ${this.model} join with ${id1}: ${data[id1]}, 'and ${id2}: ${data[id2]}, quantity: ${quantity}`);

      const connectData: Record<string, { id: string }> = {};
      connectData[id1] = { id: data[id1] };
      connectData[id2] = { id: data[id2] };

      const createData: Record<string, any> = {};
      createData[id1] = { connect: connectData[id1] }
      createData[id2] = { connect: connectData[id2] }
      createData[quantity] = data[quantity];

      const result = await this.prisma[this.model].create({
        data: createData
      });

      console.log(`${this.model} join created successfully`);
      return result;
    } catch (err) {
      throw createError(400, 'Prisma Error', {
        details: `Error creating ${this.model} join in Prisma`,
      });
    }
  }
}