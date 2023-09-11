import { Prisma } from '@prisma/client';
import createError from 'http-errors';
import BaseRepo from './baseRepository';

type FieldNames = {
  ingredient_id: 'ingredient_id';
  component_id: 'component_id';
  meal_id: 'meal_id';
};

export class JoinBaseRepo<T> extends BaseRepo<T> {
  constructor(model: Prisma.ModelName) {
    super(model);
  }

  public async create(
    data: Record<string, any>
  ): Promise<any> {
    try {
      const connectData: Record<string, { id: string }> = {};
  
      for (const key in data) {
        connectData[key] = data[key];
      }
  
      const result: T = await this.prisma[this.model].create({
        data: connectData,
      });
  
      console.log(`${this.model} join created successfully`);
      return result;
    } catch (err) {
      throw createError(400, 'Prisma Error', {
        details: `Error creating ${this.model} join in Prisma`,
        err
      });
    }
  }

  public async update(
    fieldName: string,
    data: Record<string, any>
  ): Promise<any> {
    try {
      console.log(`Updating ${this.model} with data: ${JSON.stringify(data, null, 2)}`);
  
      const id = data[fieldName];
  
      const whereCondition: Record<string, any> = {};
      whereCondition[fieldName] = {
        equals: id
      };
  
      await this.prisma[this.model].deleteMany({
        where: whereCondition
      });
  
      const result = this.prisma[this.model].create({
        data: {
          ...data
        }
      })
  
      console.log(`Updated ${this.model} join successfully`);
      return result;
    } catch (err) {
      console.log('Prisma Error:', err);
      throw createError(400, 'Prisma Error', {
        details: `Error updating component in ${this.model} in Prisma`,
      });
    }
  }

  public async delete(
    fieldName: string,
    data: Record<string, any>
  ): Promise<any> {
    try {
      console.log(`Deleting ${this.model}`);

      const id = data[fieldName];

      const whereCondition: Record<string, any> = {};
      whereCondition[fieldName] = {
        equals: id
      };
  
      const result = await this.prisma[this.model].deleteMany({
        where: whereCondition,
      });
  
      console.log(`Deleted ${this.model} join successfully`);
      return result;
    } catch (err) {
      console.log('Prisma Error:', err);
      throw createError(500, 'Prisma Error', {
        details: `Error deleting ${this.model} with Prisma`,
      });
    }
  }
}