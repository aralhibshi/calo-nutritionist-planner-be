import { Prisma, PrismaClient } from '@prisma/client';
import prisma from '@lib/prismaClient';
import { IMealData,  IMealComponentData, IMeal } from '@lib/interfaces';
import createError from 'http-errors';

export default class MealRepository {
  private prisma= prisma;
  private static instance: MealRepository | null = null

  private constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public static getInstance(
  ): MealRepository {
    if (!MealRepository.instance) {
      MealRepository.instance = new MealRepository(prisma);
    }
    return MealRepository.instance;
  }

  async createMeal(
    data: IMealData
  ): Promise<IMeal> {
    try {
      console.log('Creating Meal with data:', JSON.stringify(data, null, 2));

      const result = await this.prisma.meal.create({ data });

      console.log('Meal created successfully');
      return result;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        console.log('Conflict Error:', err);
        throw createError(409, 'Conflict Error', {
          details: 'Meal name already exists',
        });
      }

      console.log('Prisma Error:', err);
      throw createError(400, 'Prisma Error', {
        details: 'Error creating meal in Prisma',
      });
    }
  }

  async createMealComponent(
    data: IMealComponentData
  ): Promise<any> {
    try {
      console.log('Creating meal component with mealId:', data.meal_id, 'and componentId:', data.component_id);
  
      const result = await this.prisma.mealComponent.create({
        data: {
          meal: { connect: { id: data.meal_id } },
          component: { connect: { id: data.component_id } },
          component_quantity: data.component_quantity
        },
      });
  
      console.log('Meal component created successfully');
      return result;
    } catch (err) {
      console.log('Prisma Error', err)
      throw createError(400, 'Prisma Error', {
        details: 'Error creating ComponentIngredient in Prisma',
      });
    }
  }

  async getMeals(
    skip: number,
    take: number
  ): Promise<any> {
    try {
      console.log(`Fetching meals with skip: ${skip}, take: ${take}`);

      const count = await this.prisma.meal.count();
  
      const result = await this.prisma.meal.findMany({
        skip: skip,
        take: take,
        orderBy: {
          name: 'asc',
        },
        include: {
          meals_components: {
            include: {
              component: {
                include: {
                  components_ingredients: {
                    include: {
                      ingredient: true
                    }
                  }
                }
              }
            }
          }
        }
      });
  
      console.log('Meals fetched successfully');
      return {
        count,
        meals: result
      };
    } catch (err) {
      console.log('Prisma Error:', err)
      throw createError(400, 'Prisma Error', {
        details: 'Error fetching meals in Prisma',
      });
    }
  }

  async searchMeals(
    index: string
  ): Promise<any> {
    try {
      console.log('Fetching meals with name:', index);

      const count = await this.prisma.meal.count({
        where: {
          name: {
            contains: index
          }
        }
      })
  
      const result = await this.prisma.meal.findMany({
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
          meals_components: {
            include: {
              component: true
            }
          }
        }
      });
  
      console.log('Meals fetched successfully');
      return {
        count,
        meals: result
      };
    } catch (err) {
      console.log('Prisma Error', err)
      throw createError(400, 'Prisma Error', {
        details: 'Error fetching matching meals in Prisma',
      });
    }
  }

  async removeMealFomMealComponent(
    id: string
  ): Promise<any> {
    try {
      console.log('Removing meal from MealComponent');
  
      const result = await this.prisma.mealComponent.deleteMany({
        where: {
          meal_id: {
            equals: id,
          }
        }
      });
  
      console.log('Meal removed from MealComponent successfully');
      return result;
    } catch (err) {
      console.log('Prisma Error', err)
      throw createError(400, 'Prisma Error', {
        details: 'Error removing meal from MealComponent in Prisma',
      });
    }
  }

  async deleteMeal(
    id: string
  ): Promise<any> {
    try {
      console.log('Deleting meal with Id:', id);
  
      const result = await this.prisma.meal.delete({
        where: {
          id: id,
        },
      });
  
      console.log('Meal deleted successfully');
      return result;
    } catch (err) {
      console.log('Prisma Error', err)
      throw createError(400, 'Prisma Error', {
        details: 'Error deleting meal in Prisma',
      });
    }
  }
}