import { PrismaClient } from '@prisma/client';
import { middyfy } from '@lib/middleware';

const prisma = new PrismaClient();

export default middyfy(async (event) => {
  try {
    console.log('Received CloudFormation Event:', JSON.stringify(event, null, 2));

    const mealId = event.queryStringParameters && event.queryStringParameters.id;

    if (!mealId) {
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

    // Prisma - Remove Meal from MealComponent
    await removeMealFomMealComponent(mealId);

    // Prisma - Delete Ingredient
    const result = await deleteMeal(mealId);
    return result
    }
  } catch (err) {
    console.log('Error', err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: {
          title: 'Error',
          message: 'Error deleting meal',
          details: err,
        },
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
});

// Prisma - Remove Meal From MealComponent
async function removeMealFomMealComponent(id) {
  try {
    console.log('Removing meal from MealComponent');

    await prisma.mealComponent.deleteMany({
      where: {
        meal_id: {
          equals: id,
        }
      }
    });

    console.log('Meal removed from MealComponent successfully');
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: {
          title: 'Success',
          message: 'Meal removed from MealComponent successfully',
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
          message: 'Error removing meal from MealComponent with Prisma',
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
async function deleteMeal(id) {
  try {
    console.log('Deleting Meal');

    const result = await prisma.meal.delete({
      where: {
        id: id,
      },
    });

    console.log('Meal deleted successfully');
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: {
          title: 'Success',
          message: 'Meal deleted successfully',
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
          message: 'Error deleting meal with Prisma',
          details: err,
        },
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
}