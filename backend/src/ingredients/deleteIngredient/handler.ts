import { PrismaClient } from '@prisma/client';
import { middyfy } from '@lib/middleware';

const prisma = new PrismaClient();

export default middyfy(async (event) => {
  try {
    console.log('Received CloudFormation Event:', JSON.stringify(event, null, 2));

    const ingredientId = event.queryStringParameters && event.queryStringParameters.id;

    if (!ingredientId) {
      console.log('Validation Error:', 'Missing or invalid query parameter "id"');
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: {
            title: 'Validation Error',
            message: 'Missing or invalid query parameter "id"',
          },
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    } else {

    // Prisma - Remove Ingredient from ComponentIngredient
    await removeIngredientFomComponentIngredient(ingredientId);

    // Prisma - Delete Ingredient
    const result = await deleteIngredient(ingredientId);
    return result
    }
  } catch (err) {
    console.log('Error', err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: {
          title: 'Error',
          message: 'Error deleting ingredient',
          details: err,
        },
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
});

// Prisma - Remove Ingredient From ComponentIngredient
async function removeIngredientFomComponentIngredient(id) {
  try {
    console.log('Removing ingredient from ComponentIngredient');

    await prisma.componentIngredient.deleteMany({
      where: {
        ingredient_id: {
          equals: id,
        }
      }
    });

    console.log('Ingredient removed from ComponentIngredient successfully');
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: {
          title: 'Success',
          message: 'Ingredient removed from ComponentIngredient successfully',
        }
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } catch (err) {
    console.log('Prisma Error:', err);
    return {
      body: JSON.stringify({
        error: {
          title: 'Prisma Error',
          message: 'Error removing ingredient from ComponentIngredient with Prisma',
          details: err,
        },
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
}

// Prisma - Delete Ingredient
async function deleteIngredient(id) {
  try {
    console.log('Deleting ingredient');

    const result = await prisma.ingredient.delete({
      where: {
        id: id,
      },
    });

    console.log('Ingredient deleted successfully');
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: {
          title: 'Success',
          message: 'Ingredient deleted successfully',
        },
        data: result
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } catch (err) {
    console.log('Prisma Error:', err);
    return {
      body: JSON.stringify({
        error: {
          title: 'Prisma Error',
          message: 'Error deleting ingredient with Prisma',
          details: err,
        },
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
}