import { PrismaClient, Prisma } from '@prisma/client';
import { middyfy } from '@lib/middleware';

const prisma = new PrismaClient();

export default middyfy(async (event) => {
  try {
    console.log('Received CloudFormation Event:', JSON.stringify(event, null, 2));

    const requiredKeys = [
      'name',
      'description',
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

      if (result.statusCode === 201) {
        return {
          statusCode: 201,
          body: JSON.stringify({
            message: 'Ingredient created successfully',
            ingredient: ingredientData,
          })
        };
      } else if (result.statusCode === 409) {
        console.log('Conflict Error:', ingredientData.name, 'already exists');
        return {
          statusCode: 409,
          body: JSON.stringify({
            error: {
              title: 'Conflict Error',
              message: 'Ingredient name already exists',
            }
          })
        };
      }
    } else {
      console.log('Validation Error:', 'Required fields missing in request body');
      return {
        statusCode: 422,
        body: JSON.stringify({
          error: {
            title: 'Validation Error',
            message: 'Required fields missing in request body'
          }
        })
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
      })
    };
  }
});

// Prisma - Create Ingredient
async function createIngredient(data) {
  try {
    console.log('Creating ingredient with data:', JSON.stringify(data, null, 2));

    await prisma.ingredient.create({ data });

    console.log('Ingredient created successfully');

    return { statusCode: 201 };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      console.log('Conflict Error:', err);
      return { statusCode: 409 };
    }

    console.log('Error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: {
          title: 'Prisma Error',
          message: 'Error creating ingredient in Prisma',
          details: err,
        }
      })
    };
  }
}