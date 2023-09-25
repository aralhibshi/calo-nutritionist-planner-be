import { Component } from '@lib/interfaces/entities';
import { StandaloneBaseRepo } from './base/standaloneBaseRepository';
import createError from 'http-errors';

export default class ComponentRepository extends StandaloneBaseRepo<Component> {
  private static instance: ComponentRepository | null = null;

  private constructor() {
    super('Component')
  }

  public static getInstance(): ComponentRepository {
    if (!ComponentRepository.instance) {
      ComponentRepository.instance = new ComponentRepository();
    }
    return ComponentRepository.instance;
  }

  public async get(
    skip: number,
    take: number,
    name: string | undefined,
    ingredientId: string | undefined,
  ): Promise<any> {
    try {
      if (name) {
        console.log(`Fetching components with name: ${name}, skip: ${skip}, take: ${take}`)

        const count = await this.prisma.component.count({
          where: {
            name: {
              contains: name
            }
          }
        })
    
        const result = await this.prisma.component.findMany({
          skip: skip,
          take: take,
          where: {
            name: {
              contains: name,
            },
          },  
          orderBy: {
            _relevance: {
              fields: ['name'],
              search: name,
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
      } else if (ingredientId) {
        console.log(`Fetching components with ingredient_id: ${ingredientId}, skip: ${skip}, take: ${take}`)

        const count = await this.prisma.component.count({
          where: {
            components_ingredients: {
              some: {
                ingredient_id: ingredientId
              }
            }
          }
        })

        const result = await this.prisma.component.findMany({
          skip: skip,
          take: take,
          orderBy: {
            name: 'asc'
          },
          where: {
            components_ingredients: {
              some: {
                ingredient_id: ingredientId
              }
            }
          },
          include: {
            components_ingredients: {
              include: {
                ingredient: true,
              },
            },
          }
        })

        console.log('Components fetched successfully');
        return {
          count,
          components: result
        };
      } else {
        console.log(`Fetching components with skip: ${skip}, take: ${take}`);

        const count = await this.prisma.component.count()

        const result = await this.prisma.component.findMany({
          skip: skip,
          take: take,
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
      }
    } catch (err) {
      console.log('Prisma Error:', err);
      throw createError(400, 'Prisma Error', {
        details: 'Error fetching components in Prisma',
      });
    }
  } 
}