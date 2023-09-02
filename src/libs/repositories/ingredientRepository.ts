import { Prisma, PrismaClient } from '@prisma/client';
import prisma from '@lib/prismaClient';
import { IIngredientData } from '@lib/interfaces';
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
  ): Promise<any> {
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
    take: number
  ): Promise<any> {
    try {
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
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-control-Allow-Methods":"GET",
        },
        statusCode: 200,
        body: JSON.stringify({
          success: {
            title: 'Success',
            message: 'Ingredients fetched successfully',
          },
          count: count,
          data: result
        })
      };
    } catch (err) {
      console.log('Prisma Error:', err);
      throw createError(500, 'Prisma Error', {
        details: 'Error fetching ingredients in Prisma',
      });
    }
  }

  async searchIngredients(
    index: string,
    skip: number
  ): Promise<any> {
    try {
      console.log('Fetching matching ingredients with name:', index);

      const count = await this.prisma.ingredient.count({
        where: {
          name: {
            contains: index
          }
        }
      })

      const result = await this.prisma.ingredient.findMany({
        skip: skip,
        take: 9,
        where: {
          name: {
            contains: index
          }
        },
        orderBy: {
          name: 'asc',
        },
      });

      const sortedResults = result.sort((a, b) => {
        if (a.name === index && b.name !== index) {
          return -1;
        } else if (a.name !== index && b.name === index) {
          return 1;
        } else {
          return 0;
        }
      });

      console.log('Ingredients fetched successfully');
      return {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-control-Allow-Methods":"GET",
        },
        statusCode: 200,
        body: JSON.stringify({
          success: {
            title: 'Success',
            message: 'Ingredients fetched successfully',
          },
          count: count,
          data: sortedResults,
        })
      };
    } catch (err) {
      console.log('Prisma Error:', err);
      throw createError(500, 'Internal Server Error', {
        details: 'An error occurred while fetching matching ingredients in Prisma',
      });
    }
  }

  async updateIngredient(
    id: string,
    data: IIngredientData
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
      return {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-control-Allow-Methods":"GET",
        },
        statusCode: 200,
        body: JSON.stringify({
          success: {
            title: 'Success',
            message: 'Ingredient updated successfully',
          },
          data: result,
        })
      };
    } catch (err) {
      console.log('Prisma Error:', err)
      throw createError(500, 'Prisma Error', {
        details: 'Error removing ingredient from ComponentIngredient with Prisma',
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
      return {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-control-Allow-Methods":"DELETE",
        },
        statusCode: 200,
        body: JSON.stringify({
          success: {
            title: 'Success',
            message: 'Component removed from ComponentIngredient successfully',
          },
          data: result
        })
      };
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

      return {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-control-Allow-Methods":"DELETE",
        },
        statusCode: 200,
        body: JSON.stringify({
          success: {
            title: 'Success',
            message: 'Ingredient deleted successfully',
          },
          data: result
        })
      };
    } catch (err) {
      console.log('Prisma Error:', err);
      throw createError(500, 'Prisma Error', {
        details: 'Error deleting ingredient with Prisma',
      });
    }
  }
}