import { PrismaClient, Prisma } from '@prisma/client';
import { middyfy } from '@lib/middleware';

const prisma = new PrismaClient();

export default middyfy(async (event) => {
  try {
    console.log('Received CloudFormation Event:', JSON.stringify(event, null, 2));

    const requiredKeys = [
      'name',
      'price',
      // 'calories',
      'protein',
      'fats',
      'carbs',
      'unit'
    ];

    if (requiredKeys.every(key => event.body[key] !== undefined)) {
      const ingredientData = {
        ...event.body,
        name: capitalizeFirstLetter(event.body.name),
      };

      // Prisma - Create Ingredient
      const result = await createIngredient(ingredientData);
      return result;
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

    const protein = data.protein;
    const carbs = data.carbs;
    const fats = data.fats;
    const calories = (protein * 4) + (carbs * 4) + (fats * 9);

    // Merge the calculated calories into the ingredient data.
    const ingredientData = {
      ...data,
      calories: calories.toFixed(3), // Round to 3 decimal places as per your schema.
    };

    const result = await prisma.ingredient.create({ data: ingredientData });

    console.log('Ingredient created successfully', result);

    return {
      statusCode: 201,
      body: JSON.stringify({
        success: {
          title: 'Success',
          message: 'Ingredient created successfully'
        },
        data: result
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

// Capitalize First Letter of String
function capitalizeFirstLetter(string) {
  return string.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}