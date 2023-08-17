import { PrismaClient, Prisma } from '@prisma/client';
import { middyfy } from '@lib/middleware';

const prisma = new PrismaClient();

export default middyfy(async (event) => {
  try {
    console.log('Received CloudFormation Event:', JSON.stringify(event, null, 2));

    const requiredKeys = [
    'name',
    'unit'
    ];

    if (requiredKeys.every(key => event.body[key] !== undefined)) {
      const mealData = event.body;
      const componentId = mealData.componentId

      // Prisma - Create Ingredient
      const result = await createMeal(mealData,componentId);

      if (result.statusCode === 201) {
        const createdMealUUID = result.meal?.id;
        return {    
            statusCode: 201,
            body: JSON.stringify({
              success: {
                title: 'Success',
                message: 'Meal created successfully'
              },
              data: {
                ...mealData,
                id: createdMealUUID // Include the UUID in the response body
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
// Prisma - Create Component
async function createMeal(data, componentId) {
  try {
    console.log('Creating Meal with data:', JSON.stringify(data, null, 2));

    const createdMeal = await prisma.meal.create({
        data: {
            name: data.name,
            // description: data.description, // Add the description property if necessary
            size: data.size, // Add the size property if necessary
            unit: data.unit,
            // Add other fields if necessary
          },
      });

    console.log('Component created successfully');

    if (createdMeal) {
      const mealId = createdMeal.id;
    //   const ingredientId = '67d3e029-687c-4d13-91b1-cd7c7aa816c0'; // Replace with the actual ingredient ID

      await createMealComponent(mealId, componentId);
    }

    return {
      statusCode: 201,
      meal: createdMeal
    };
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
          message: 'Error creating Meal in Prisma',
          details: err
        }
      })
    };
  }
}


// Prisma - Create Component Ingredient
async function createMealComponent(mealId, componentId) {
    try {
      console.log('Creating meal component with mealId:', mealId, 'and componentId:', componentId);
  
      const createdMealIngredient = await prisma.mealComponent.create({
        data: {
          meal: { connect: { id: mealId } },
          component: { connect: { id: componentId } },
          component_quantity:1
         // Replace with the correct property name for the ingredient quantity
        },
      });
  
      console.log('Component ingredient created successfully');
  
      return createdMealIngredient;
    } catch (err) {
      console.log('Error:', err);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: {
            title: 'Prisma Error',
            message: 'Error creating meal component in Prisma',
            details: err,
          }
        })
      };
    }
  }