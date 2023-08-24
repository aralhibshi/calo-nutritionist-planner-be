import { Prisma, PrismaClient } from '@prisma/client';
import { IIngredientData } from '@lib/interfaces';
import createError from 'http-errors';

export default class IngredientRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createIngredient(data: IIngredientData): Promise<any> {
    try {
      console.log('Creating ingredient with data:', JSON.stringify(data, null, 2));

      const ingredientData = {
        ...data
      };

      const result = await this.prisma.ingredient.create({ data: ingredientData });

      console.log('Ingredient created successfully');
      return {
        statusCode: 201,
        body: JSON.stringify({
          success: {
            title: 'Success',
            message: 'Ingredient created successfully'
          },
          data: result
        })
      };
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

  async getIngredients(): Promise<any> {
    try {
      console.log('Fetching ingredients');

      const result = await this.prisma.ingredient.findMany();

      console.log('Ingredients fetched successfully');
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: {
            title: 'Success',
            message: 'Ingredients fetched successfully',
          },
          data: result,
        })
      };
    } catch (err) {
      console.log('Prisma Error:', err);
      throw createError(500, 'Prisma Error', {
        details: 'Error fetching ingredients in Prisma',
      });
    }
  }

  async searchIngredients(index: string): Promise<any> {
    try {
      console.log('Fetching matching ingredients with name:', index);

      const result = await this.prisma.ingredient.findMany({
        where: {
          name: {
            contains: index,
          },
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
        statusCode: 200,
        body: JSON.stringify({
          success: {
            title: 'Success',
            message: 'Ingredients fetched successfully',
          },
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

  async updateIngredient(id: string, data: IIngredientData): Promise<any> {
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

  async removeIngredientFromComponentIngredient(id: string): Promise<any> {
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

  async deleteIngredient(id: string): Promise<any> {
    try {
      console.log('Deleting ingredient with Id:', id);
  
      const result = await this.prisma.ingredient.delete({
        where: {
          id: id,
        },
      });
  
      console.log('Ingredient deleted successfully');

      return {
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