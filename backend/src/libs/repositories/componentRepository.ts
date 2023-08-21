import { Prisma, PrismaClient } from '@prisma/client';
import createError from 'http-errors';

interface CreateComponentInput {
  name: string;
  category?: string;
  description?: string;
  unit: string;
}

export interface Ingredients {
  ingredientId: string,
  ingredient_quantity: number
}

interface CreateComponentIngredientInput {
  componentId: string,
  ingredientId: string,
  ingredientQuantity: number
}

export default class ComponentRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createComponent(data: CreateComponentInput): Promise<any> {
    try {
      console.log('Creating component with data:', JSON.stringify(data, null, 2));

      const result = await this.prisma.component.create({ data });
      const componentId = result.id;

      console.log('Component created successfully', result);

      return {
        statusCode: 201,
        body: {
          success: {
            title: 'Success',
            message: 'Component created successfully'
          },
          data: {
            componentId,
            ...result,
          }
        }
      };
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        console.log('Conflict Error:', err);
        throw createError(409, 'Conflict Error', {
          details: 'Component name already exists',
        });
      }

      console.log('Prisma Error:', err);
      throw createError(400, 'Prisma Error', {
        details: 'Error creating component in Prisma',
      });
    }
  }

  async createComponentIngredient(data: CreateComponentIngredientInput) {
    try {
      console.log('Creating component ingredient with componentId:', data.componentId, 'and ingredientId:', data.ingredientId);

      const result = await this.prisma.componentIngredient.create({
        data: {
          component: { connect: { id: data.componentId } },
          ingredient: { connect: { id: data.ingredientId } },
          ingredient_quantity: data.ingredientQuantity,
        },
      });

      console.log('Component ingredient created successfully');

      return {
        statusCode: 201,
        body: JSON.stringify({
          success: {
            title: 'Success',
            message: 'ComponentIngredient created successfully'
          },
          data: result
        })
      };
    } catch (err) {
      throw createError(400, 'Prisma Error', {
        details: 'Error creating ComponentIngredient in Prisma',
      });
    }
  }
}