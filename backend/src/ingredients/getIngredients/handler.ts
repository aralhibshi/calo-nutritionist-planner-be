import { PrismaClient } from '@prisma/client';
import { middyfy } from '@lib/middleware';

const prisma = new PrismaClient();

export default middyfy(async (event) => {
  try {
    console.log('Received CloudFormation Event:', JSON.stringify(event, null, 2));

    // Prisma - Get Ingredients
    const result = await getIngredients();
    return result;
  } catch (err) {
    console.log('Error', err)
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: {
          title: 'Error',
          message: 'Error fetching ingredients',
          details: err
        }
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  }
})

// Prisma - Get Ingredients
async function getIngredients() {
  try {
    console.log('Fetching ingredients');

    const result = await prisma.ingredient.findMany();

    console.log('Ingredients fetched successfully', result);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: {
          title: 'Success',
          message: 'Ingredient fetched successfully'
        },
        data: result
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    };
  } catch (err) {
    console.log('Prisma Error:', err)
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: {
          title: 'Prisma Error',
          message: 'Error fetching ingredients in Prisma',
          details: err
        }
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  }
}