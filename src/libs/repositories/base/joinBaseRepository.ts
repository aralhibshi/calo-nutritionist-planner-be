import { Prisma } from '@prisma/client';
import createError from 'http-errors';
import BaseRepo from './baseRepository';

export class JoinBaseRepo<T> extends BaseRepo<T> {
  private static fieldNames: Record<string, string> = {
    ingredient_id: 'ingredient_id',
    component_id: 'component_id',
    meal_id: 'meal_id'
  };

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

  public async delete(
    data: Record<string, any>
  ): Promise<any> {
    try {
      console.log(`Deleting ${this.model}`);

      const entityType = Object.keys(JoinBaseRepo.fieldNames).find((key) => key in data);
      if (!entityType) {
        throw new Error('Unsupported entity type');
      }

      const fieldName = JoinBaseRepo.fieldNames[entityType];
  
      const whereCondition: Record<string, any> = {};
      whereCondition[fieldName] = {
        equals: data.id,
      };
  
      const result: T = await this.prisma[this.model].deleteMany({
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

  public async update(
    data: Record<string, any>
  ): Promise<any> {
    try {
      console.log(`Updating ${this.model}`);

      const entityType = Object.keys(JoinBaseRepo.fieldNames).find((key) => key in data);

      if (!entityType) {
        throw new Error('Unsupported entity type');
      }

      const fieldName = JoinBaseRepo.fieldNames[entityType];
  
      const whereCondition: Record<string, any> = {};
      whereCondition[fieldName] = {
        equals: data.id,
      };
  
      const result: T = await this.prisma[this.model].deleteMany({
        where: whereCondition,
        data: data
      });

      console.log(`Updated ${this.model} join successfully`);
      return result;
    } catch (err) {
      console.log('Prisma Error:', err);
      throw createError(400, 'Prisma Error', {
        details: `Error updating component in ${this.model} in Prisma`,
      });
    }
  }
}