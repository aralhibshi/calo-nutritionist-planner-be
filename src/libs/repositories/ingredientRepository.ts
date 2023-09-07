import { Prisma, PrismaClient } from '@prisma/client';
import prisma from '@lib/prismaClient';
import { IIngredient, IIngredientData, IIngredientUpdateData } from '@lib/interfaces';
import createError from 'http-errors';

export default class IngredientRepository {
  private prisma = prisma;
  private static instance: IngredientRepository | null = null;

  private constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public static getInstance(
  ): IngredientRepository {
    if (!IngredientRepository.instance) {
      IngredientRepository.instance = new IngredientRepository(prisma);
    }
    return IngredientRepository.instance;
  }

  async createIngredient(
    data: IIngredientData
  ): Promise<IIngredient> {
    try {
      console.log('Creating ingredient with data:', JSON.stringify(data, null, 2));

      const ingredientData = {
        ...data
      };

      const result = await this.prisma.ingredient.create({ data: ingredientData });

      console.log('Ingredient created successfully');
      return result;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        console.log('Conflict Error:', err);
        throw createError(409, 'Conflict Error', {
          details: 'Ingredient name already exists',
        });
      }

      console.log('Prisma Error:', err);
      throw createError(400, 'Prisma Error', {
        details: 'Error creating ingredient in Prisma',
      });
    }
  }

  async getIngredients(
    skip: number,
    take: number,
    name: string | undefined
  ): Promise<any> {
    try {
      if (name) {
        console.log(`Fetching ingredients with name: ${name}, skip: ${skip}, take: ${take}`)

        const count = await this.prisma.ingredient.count({
          where: {
            name: {
              contains: name
            }
          }
        })
  
        const result = await this.prisma.ingredient.findMany({
          skip: skip,
          take: take,
          orderBy: {
            _relevance: {
              fields: ['name'],
              search: name,
              sort: 'asc'
            }
          },
          where: {
            name: {
              contains: name
            }
          }
        });
  
  
        console.log('Ingredients fetched successfully');
        return {
          count,
          ingredients: result
        }
      } else {
        console.log(`Fetching ingredients with skip: ${skip}, take: ${take}`);
      
        const count = await this.prisma.ingredient.count();

        const result = await this.prisma.ingredient.findMany({
          skip: skip,
          take: take,
          orderBy: [
            {
              name: 'asc',
            }
          ]
        });

        console.log('Ingredients fetched successfully');
        return {
          count,
          ingredients: result
        }
      }
    } catch (err) {
      console.log('Prisma Error:', err);
      throw createError(500, 'Prisma Error', {
        details: 'Error fetching ingredients in Prisma',
      });
    }
  }

  async updateIngredient(
    id: string,
    data: IIngredientUpdateData
  ): Promise<any> {
    try {
      console.log(`Updating ingredient with Id: ${id}, data:`, JSON.stringify(data, null, 2));

      const ingredientData = {
        ...data,
      };

      const result = await this.prisma.ingredient.update({
        where: {
          id: id
        },
        data: {
          ...ingredientData
        }
      })

      console.log('Ingredient updated successfully');
      return result;
    } catch (err) {
      console.log('Prisma Error:', err)
      throw createError(500, 'Prisma Error', {
        details: 'Error updating ingredient with Prisma Prisma',
      });
    }
  }

  async removeIngredientFromComponentIngredient(
    id: string
  ): Promise<any> {
    try {
      console.log('Removing ingredient from ComponentIngredient');
  
      const result = await this.prisma.componentIngredient.deleteMany({
        where: {
          ingredient_id: {
            equals: id,
          }
        }
      });
  
      console.log('Ingredient removed from ComponentIngredient successfully');
      return result;
    } catch (err) {
      console.log('Prisma Error:', err);
      throw createError(500, 'Prisma Error', {
        details: 'Error removing ingredient from ComponentIngredient with Prisma',
      });
    }
  }

  async deleteIngredient(
    id: string
  ): Promise<any> {
    try {
      console.log('Deleting ingredient with Id:', id);
  
      const result = await this.prisma.ingredient.delete({
        where: {
          id: id,
        },
      });
  
      console.log('Ingredient deleted successfully');
      return result;
    } catch (err) {
      console.log('Prisma Error:', err);
      throw createError(500, 'Prisma Error', {
        details: 'Error deleting ingredient with Prisma',
      });
    }
  }
}