import { Ingredient } from '@lib/interfaces/entities';
import { StandaloneBaseRepo } from './base/standaloneBaseRepository';
import createError from 'http-errors';

export default class IngredientRepository extends StandaloneBaseRepo<Ingredient> {
  private static instance: IngredientRepository | null = null;

  private constructor() {
    super('Ingredient')
  }

  public static getInstance(): IngredientRepository {
    if (!IngredientRepository.instance) {
      IngredientRepository.instance = new IngredientRepository();
    }
    return IngredientRepository.instance;
  }

  public async get(
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
}