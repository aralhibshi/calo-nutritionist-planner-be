import { PrismaClient } from '@prisma/client';
import { middyfy } from '@lib/middleware';

const prisma = new PrismaClient();

export default middyfy(async (event) => {
  try {
    console.log('Received CloudFormation Event:', JSON.stringify(event, null, 2));

    const componentId = event.queryStringParameters && event.queryStringParameters.id;

    if (!componentId) {
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

    // Prisma - Remove Component from MealComponent
    await removeComponentFomMealComponent(componentId);

    // Prisma - Delete Component
    const result = await deleteComponent(componentId);
    return result
    }
  } catch (err) {
    console.log('Error', err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: {
          title: 'Error',
          message: 'Error deleting component',
          details: err,
        },
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
});

// Prisma - Remove Component From MealComponent
async function removeComponentFomMealComponent(id) {
  try {
    console.log('Removing component from MealComponent');

    await prisma.mealComponent.deleteMany({
      where: {
        component_id: {
          equals: id,
        }
      }
    });

    console.log('Component removed from MealComponent successfully');
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: {
          title: 'Success',
          message: 'Component removed from MealComponent successfully',
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
          message: 'Error removing component from MealComponent with Prisma',
          details: err,
        },
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
}

// Prisma - Delete Component
async function deleteComponent(id) {
  try {
    console.log('Deleting component');

    const result = await prisma.component.delete({
      where: {
        id: id,
      },
    });

    console.log('Component deleted successfully');
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: {
          title: 'Success',
          message: 'Component deleted successfully',
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
          message: 'Error deleting component with Prisma',
          details: err,
        },
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
}