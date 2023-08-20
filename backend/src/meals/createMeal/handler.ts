import { PrismaClient, Prisma } from '@prisma/client';
import { middyfy } from '@lib/middleware';

const prisma = new PrismaClient();

export default middyfy(async (event) => {
  try {
    console.log('Received CloudFormation Event:', JSON.stringify(event, null, 2));

    const requiredKeys = [
      'name',
      'size',
      'unit',
      'components',
    ];

    if (requiredKeys.every(key => event.body[key] !== undefined)) {
      const mealData = {
        ...event.body,
        name: capitalizeFirstLetter(event.body.name),
        size: capitalizeFirstLetter(event.body.size),
      };
      const components = mealData.components;
      delete mealData.components;

      // Prisma - Create Meal
      const result: any = await createMeal(mealData, components);

      if (result.statusCode === 201) {
        const createdMealUUID = result.body?.data?.id;
        return {
          statusCode: 201,
          body: JSON.stringify({
            success: {
              title: 'Success',
              message: 'Component created successfully'
            },
            data: {
              ...mealData,
              id: createdMealUUID
            }
          })
        };
      } else if (result.statusCode === 409) {
        console.log('Conflict Error:', mealData.name, 'already exists');
        return {
          statusCode: 409,
          body: JSON.stringify({
            error: {
              title: 'Conflict Error',
              message: 'Meal name already exists',
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
          message: 'Error creating meal',
          details: err,
        }
      })
    };
  }
});

// Prisma - Create Meal
async function createMeal(data, components) {
  try {
    console.log('Creating Meal with data:', JSON.stringify(data, null, 2));

    const createdMeal = await prisma.meal.create({ data });

    console.log('Meal created successfully');

    if (createdMeal) {
      const mealId = createdMeal.id;

      for (const component of components) {
        await createMealComponent(mealId, component.componentId, component.component_quantity);
      }
    }

    return {
      statusCode: 201,
      body: {
        success: {
          title: 'Success',
          message: 'Meal created successfully'
        },
        data: createdMeal
      }
    };
  } catch (err) {
    // ...
  }
}

// Prisma - Create Meal Component
async function createMealComponent(mealId, componentId, componentQuantity) {
  try {
    console.log('Creating meal component with mealId:', mealId, 'and componentId:', componentId);

    const createdMealComponent = await prisma.mealComponent.create({
      data: {
        meal: { connect: { id: mealId } },
        component: { connect: { id: componentId } },
        component_quantity: componentQuantity
      },
    });

    console.log('Meal component created successfully');

    return createdMealComponent;
  } catch (err) {
    // ...
  }
}

// Capitalize First Letter of String
function capitalizeFirstLetter(string) {
  return string.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}