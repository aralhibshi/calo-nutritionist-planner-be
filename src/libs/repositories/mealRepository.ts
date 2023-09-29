import { Meal } from '@lib/interfaces/entities';
import { StandaloneBaseRepo } from './base/standaloneBaseRepository';
import createError from 'http-errors';

export default class MealRepository extends StandaloneBaseRepo<Meal> {
  private static instance: MealRepository | null = null;

  private constructor() {
    super('Meal')
  }

  public static getInstance(): MealRepository {
    if (!MealRepository.instance) {
      MealRepository.instance = new MealRepository();
    }
    return MealRepository.instance;
  }

  public async getMeals(
    skip: number,
    take: number,
    name: string | undefined,
    ingredientId: string | undefined,
    componentId: string | undefined
  ): Promise<any> {
    try {
      if (name) {
        console.log(`Fetching matching meals with name: ${name}, skip: ${skip}, take: ${take}`);

        const count = await this.prisma.meal.count({
          where: {
            name: {
              contains: name
            }
          }
        })
    
        const result = await this.prisma.meal.findMany({
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

      } else if (ingredientId) {
        console.log(`Fetching meals with ingredient_id: ${ingredientId}, skip: ${skip}, take: ${take}`)

        const count = await this.prisma.meal.count({
          where: {
            meals_components: {
              some: {
                component: {
                  components_ingredients: {
                    some: {
                      ingredient_id: ingredientId
                    }
                  }
                }
              }
            }
          }
        })

        const result = await this.prisma.meal.findMany({
          skip: skip,
          take: take,
          orderBy: {
            name: 'asc'
          },
          where: {
            meals_components: {
              some: {
                component: {
                  components_ingredients: {
                    some: {
                      ingredient_id: ingredientId
                    }
                  }
                }
              }
            }
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
              },
            },
          }
        })

        console.log('Meals fetched successfully');
        return {
          count,
          meals: result
        };
      } else if (componentId) {
        console.log(`Fetching meals with component_id: ${componentId}, skip: ${skip}, take: ${take}`)

        const count = await this.prisma.meal.count({
          where: {
            meals_components: {
              some: {
                component_id: componentId
              }
            }
          }
        })

        const result = await this.prisma.meal.findMany({
          skip: skip,
          take: take,
          orderBy: {
            name: 'asc'
          },
          where: {
            meals_components: {
              some: {
                component_id: componentId
              }
            }
          },
          include: {
            meals_components: {
              include: {
                component: true,
              },
            },
          }
        })

        console.log('Meals fetched successfully');
        return {
          count,
          meals: result
        };
      } else {
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
      }
    } catch (err) {
      console.log('Prisma Error:', err)
      throw createError(400, 'Prisma Error', {
        details: 'Error fetching meals in Prisma',
      });
    }
  }
}