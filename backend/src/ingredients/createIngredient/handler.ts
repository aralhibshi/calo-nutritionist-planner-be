import { PrismaClient } from '@prisma/client';
import { middyfy } from '@lib/middleware';

const prisma = new PrismaClient();

export default middyfy(async () => {
  try {
    // await prisma.ingredient.deleteMany()
    
    const ingredient = await prisma.ingredient.create({ data: {
      name: 'White Rice',
      description: 'Basmati white rice',
      price: 0.027,
      calories: 0.5,
      protein: 0.3,
      fats: 0.2,
      carbs: 0.4,
      unit: 'g'
    }})
    console.log(ingredient)
    return {
      statusCode: 201,
      body: {
        message: 'Ingredient Created',
        ingredient
      }
    }
  } catch (err) {
    console.log(err)
    return {
      body: {
        error: {
          title: 'Prisma Error',
          message: 'Error creating ingredient',
          err
        }
      }
    }
  }
});