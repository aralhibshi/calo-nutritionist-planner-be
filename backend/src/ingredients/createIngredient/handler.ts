import { PrismaClient, Prisma } from '@prisma/client';
import { middyfy } from '@lib/middleware';

const prisma = new PrismaClient();

export default middyfy(async (event) => {
  try {
    console.log('Received CloudFormation Event:', JSON.stringify(event, null, 2));

    const requiredKeys = [
      'name',
      'price',
      'calories',
      'protein',
      'fats',
      'carbs',
      'unit'
    ];

    if (requiredKeys.every(key => event.body[key] !== undefined)) {
      const ingredientData = event.body;

      // Prisma - Create Ingredient
      const result = await createIngredient(ingredientData);
      return result
      
    } else {
      console.log('Validation Error:', 'Required fields missing in request body');
      return {
        statusCode: 422,
        body: JSON.stringify({
          error: {
            title: 'Validation Error',
            message: 'Required fields missing in request body'
          }
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      };
    }
  } catch (err) {
    console.log('Error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: {
          title: 'Error',
          message: 'Error creating ingredient',
          details: err,
        }
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    };
  }
});

// Prisma - Create Ingredient
async function createIngredient(data) {
  try {
    console.log('Creating ingredient with data:', JSON.stringify(data, null, 2));

    const ingredient = await prisma.ingredient.create({ data });

    console.log('Ingredient created successfully');

    return {
      statusCode: 201,
      body: JSON.stringify({
        success: {
          title: 'Success',
          message: 'Ingredient created successfully'
        },
        data: ingredient
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      console.log('Conflict Error:', err);
        return {
          statusCode: 409,
          body: JSON.stringify({
            error: {
              title: 'Conflict Error',
              message: 'Ingredient name already exists',
              details: err
            }
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        };
    }

    console.log('Prisma Error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: {
          title: 'Prisma Error',
          message: 'Error creating ingredient in Prisma',
          details: err,
        }
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    };
  }
}