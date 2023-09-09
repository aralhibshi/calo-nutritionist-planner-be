import { Prisma, PrismaClient } from '@prisma/client';
import prisma from '@lib/prismaClient';
// import { IComponent, IComponentData, IComponentIngredient, IComponentIngredientData, IComponentUpdateData, IMealComponentData } from '@lib/interfaces';
import { Component } from '@lib/interfaces/entities';
import createError from 'http-errors';

import BaseRepo from './baseRepository';

export default class ComponentRepository extends BaseRepo<Component> {
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

  async getComponents(
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

// export default class ComponentRepository {

//   async updateComponent(
//     id: string,
//     data: IComponentUpdateData
//   ): Promise<any> {
//     try {
//       console.log('Updating component with Id:', id);
  
//       const result = await this.prisma.component.update({
//         where: {
//           id: id,
//         },
//         data: {
//           name: data.name,
//           category: data.category,
//           description: data.description,
//           unit: data.unit,
//         },
//       });
  
//       console.log('Component updated successfully');
//       return result;
//     } catch (err) {
//       console.log('Prisma Error:', err);
//       throw createError(400, 'Prisma Error', {
//         details: 'Error updating component from component in Prisma',
//       });
//     }
//   }

//   async updateComponentInComponentIngredient(
//     id: string,
//     data: IComponentIngredientData
//   ): Promise<any> {
//     try {
//       console.log('Updating component in ComponentIngredient');

//       const result = await this.prisma.componentIngredient.updateMany({
//         where: {
//           component_id: {
//             equals: id
//           }
//         },
//         data: data
//       })

//       console.log('Component updated in ComponentIngredient successfully');
//       // return result;
//     } catch (err) {
//       console.log('Prisma Error:', err);
//       throw createError(400, 'Prisma Error', {
//         details: 'Error updating component in ComponentIngredient in Prisma',
//       });
//     }
//   }


//   async removeComponentFromComponentIngredient(
//     id: string
//   ): Promise<any> {
//     try {
//       console.log('Removing component from ComponentIngredient');

//       const result = await this.prisma.componentIngredient.deleteMany({
//         where: {
//           component_id: {
//             equals: id
//           }
//         }
//       })

//       console.log('Component removed from ComponentIngredient successfully');
//       return result;
//     } catch (err) {
//       console.log('Prisma Error:', err);
//       throw createError(400, 'Prisma Error', {
//         details: 'Error removing component from ComponentIngredient in Prisma',
//       });
//     }
//   }

//   async removeComponentFomMealComponent(
//     id: string
//   ): Promise<any> {
//     try {
//       console.log('Removing component from MealComponent');

//       const result = await this.prisma.mealComponent.deleteMany({
//         where: {
//           component_id: {
//             equals: id
//           }
//         }
//       });

//       console.log('Component removed from MealComponent successfully');
//       return result;
//     } catch (err) {
//       console.log('Prisma Error:', err);
//       throw createError(400, 'Prisma Error', {
//         details: 'Error removing component from MealComponent in Prisma',
//       });
//     }
//   }

//   async deleteComponent(
//     id: string
//   ): Promise<any> {
//     try {
//       console.log('Deleting component with Id:', id);
  
//       const result = await this.prisma.component.delete({
//         where: {
//           id: id,
//         },
//       });
  
//       console.log('Component deleted successfully');
//       return result;
//     } catch (err) {
//       console.log('Prisma Error:', err);
//       throw createError(400, 'Prisma Error', {
//         details: 'Error deleting component from component in Prisma',
//       });
//     }
//   }
// }