import { Prisma } from '@prisma/client';
import createError from 'http-errors';
import BaseRepo from './baseRepository';

export class StandaloneBaseRepo<T> extends BaseRepo<T> {
  constructor(model: Prisma.ModelName) {
    super(model);
  }

  public async create(
    data: T
  ): Promise<T> {
    try {
      console.log(`Creating ${this.model} with data:`, JSON.stringify(data, null, 2));

      const result: T = await this.prisma[this.model].create({ data });

      console.log(`${this.model} created successfully`);
      return result;
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

  public async update(
    data: T & { id: string }
  ): Promise<any> {
    try {
      console.log(`Updating ${this.model} with data:`, JSON.stringify(data, null, 2));

      const { id, ...updateData } = data;

      const result: T = await this.prisma[this.model].update({
        where: {
          id: id
        },
        data: {
          ...updateData
        }
      })

      console.log(`${this.model} updated successfully`);
      return result;
    } catch (err) {
      console.log('Prisma Error:', err)
      throw createError(500, 'Prisma Error', {
        details: `Error updating ${this.model} with Prisma Prisma`,
      });
    }
  }

  public async delete(
    id: string
  ): Promise<any> {
    try {
      console.log(`Deleting ${this.model} with Id:`, id);
  
      const result: T = await this.prisma[this.model].delete({
        where: {
          id: id,
        },
      });
  
      console.log(`${this.model} deleted successfully`);
      return result;
    } catch (err) {
      console.log('Prisma Error:', err);
      throw createError(500, 'Prisma Error', {
        details: `Error deleting ${this.model} with Prisma`,
      });
    }
  }
}