import { Prisma, PrismaClient } from '@prisma/client';
import prisma from '@lib/prismaClient';
import { IComponent, IComponentData, IComponentIngredient, IComponentIngredientData } from '@lib/interfaces';
import createError from 'http-errors';

export default class ComponentRepository {
  private prisma= prisma;
  private static instance: ComponentRepository | null = null

  private constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public static getInstance(
  ): ComponentRepository {
    if (!ComponentRepository.instance) {
      ComponentRepository.instance = new ComponentRepository(prisma);
    }
    return ComponentRepository.instance;
  }

  async createComponent(
    data: IComponentData
  ): Promise<IComponent> {
    try {
      console.log('Creating component with data:', JSON.stringify(data, null, 2));

      const result = await this.prisma.component.create({ data });

      console.log('Component created successfully');
      return result;
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

  async createComponentIngredient(
    data: IComponentIngredientData
  ): Promise<IComponentIngredient> {
    try {
      console.log('Creating component ingredient with componentId:', data.component_id, 'and ingredientId:', data.ingredient_id);

      const result = await this.prisma.componentIngredient.create({
        data: {
          component: { connect: { id: data.component_id } },
          ingredient: { connect: { id: data.ingredient_id } },
          ingredient_quantity: data.ingredient_quantity,
        },
      });

      console.log('Component ingredient created successfully');
      return result;
    } catch (err) {
      throw createError(400, 'Prisma Error', {
        details: 'Error creating ComponentIngredient in Prisma',
      });
    }
  }

  async getComponents(
    skip: number
  ): Promise<any> {
    try {
      console.log(`Fetching components with skip: ${skip}`);

      const count = await this.prisma.component.count()
  
      const result = await this.prisma.component.findMany({
        skip: skip,
        take: 9,
        orderBy: {
          name: 'asc',
        },
        include: {
          components_ingredients: {
            include: {
              ingredient: true,
            },
          },
        },
      });

  
      console.log('Components fetched successfully');
      return {
        count,
        components: result
      };
    } catch (err) {
      console.log('Prisma Error:', err);
      throw createError(400, 'Prisma Error', {
        details: 'Error fetching components in Prisma',
      });
    }
  }  

  async searchComponents(
    index: string,
    skip: number
  ): Promise<any> {
    try {
      console.log(`Fetching matching components with name: ${index}, skip: ${skip}`);

      const count = await this.prisma.component.count({
        where: {
          name: {
            contains: index
          }
        }
      })
  
      const result = await this.prisma.component.findMany({
        skip: skip,
        take: 9,
        where: {
          name: {
            contains: index,
          },
        },
        orderBy: {
          _relevance: {
            fields: ['name'],
            search: index,
            sort: 'asc'
          }
        },
        include: {
          components_ingredients: {
            include: {
              ingredient: true
            }
          }
        }
      });
  
      console.log('Components fetched successfully');
      return {
        count,
        components: result
      };
    } catch (err) {
      console.log('Prisma Error:', err);
      throw createError(400, 'Prisma Error', {
        details: 'Error fetching matching components in Prisma',
      });
    }
  }

  async removeComponentFromComponentIngredient(
    id: string
  ): Promise<any> {
    try {
      console.log('Removing component from ComponentIngredient');

      const result = await this.prisma.componentIngredient.deleteMany({
        where: {
          component_id: {
            equals: id
          }
        }
      })

      console.log('Component removed from ComponentIngredient successfully');
      return result;
    } catch (err) {
      console.log('Prisma Error:', err);
      throw createError(400, 'Prisma Error', {
        details: 'Error removing component from ComponentIngredient in Prisma',
      });
    }
  }

  async removeComponentFomMealComponent(
    id: string
  ): Promise<any> {
    try {
      console.log('Removing component from MealComponent');

      const result = await this.prisma.mealComponent.deleteMany({
        where: {
          component_id: {
            equals: id
          }
        }
      });

      console.log('Component removed from MealComponent successfully');
      return result;
    } catch (err) {
      console.log('Prisma Error:', err);
      throw createError(400, 'Prisma Error', {
        details: 'Error removing component from MealComponent in Prisma',
      });
    }
  }

  async deleteComponent(
    id: string
  ): Promise<any> {
    try {
      console.log('Deleting component with Id:', id);
  
      const result = await this.prisma.component.delete({
        where: {
          id: id,
        },
      });
  
      console.log('Component deleted successfully');
      return result;
    } catch (err) {
      console.log('Prisma Error:', err);
      throw createError(400, 'Prisma Error', {
        details: 'Error deleting component from component in Prisma',
      });
    }
  }
}