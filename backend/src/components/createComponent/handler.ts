import { PrismaClient, Prisma } from '@prisma/client';
import { middyfy } from '@lib/middleware';

const prisma = new PrismaClient();

export default middyfy(async (event) => {
  try {
    console.log('Received CloudFormation Event:', JSON.stringify(event, null, 2));

    const requiredKeys = [
      'ingredientId',
      'name',
      'unit'
    ];

    if (requiredKeys.every(key => event.body[key] !== undefined)) {
      const componentData = {
        ...event.body,
        name: capitalizeFirstLetter(event.body.name),
      };
      const ingredientId = componentData.ingredientId
      delete componentData.ingredientId;

      // Prisma - Create Component
      const result = await createComponent(componentData,ingredientId);

      if (result.statusCode === 201) {
        const createdComponentUUID = result.component?.id;
        return {
            statusCode: 201,
            body: JSON.stringify({
              success: {
                title: 'Success',
                message: 'Component created successfully'
              },
              data: {
                ...componentData,
                id: createdComponentUUID // Include the UUID in the response body
              }
            })
          };
      } else if (result.statusCode === 409) {
        console.log('Conflict Error:', componentData.name, 'already exists');
        return {
          statusCode: 409,
          body: JSON.stringify({
            error: {
              title: 'Conflict Error',
              message: 'Component name already exists',
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
          message: 'Error creating component',
          details: err,
        }
      })
    };
  }
});

// Prisma - Create Component
async function createComponent(data, ingredientId) {
  try {
    console.log('Creating component with data:', JSON.stringify(data, null, 2));

    const createdComponent = await prisma.component.create({ data });

    console.log('Component created successfully');

    if (createdComponent) {
      const componentId = createdComponent.id;

      await createComponentIngredient(componentId, ingredientId);
    }

    return {
      statusCode: 201,
      component: createdComponent
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
          message: 'Error creating component in Prisma',
          details: err
        }
      })
    };
  }
}

// Prisma - Create Component
async function createComponentIngredient(componentId, ingredientId) {
    try {
      console.log('Creating component ingredient with componentId:', componentId, 'and ingredientId:', ingredientId);
  
      const createdComponentIngredient = await prisma.componentIngredient.create({
        data: {
          component: { connect: { id: componentId } },
          ingredient: { connect: { id: ingredientId } },
          ingredient_quantity: 1, // Replace with the desired ingredient quantity
        },
      });
  
      console.log('Component ingredient created successfully');
  
      return createdComponentIngredient;
    } catch (err) {
      console.log('Error:', err);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: {
            title: 'Prisma Error',
            message: 'Error creating component ingredient in Prisma',
            details: err,
          }
        })
      };
    }
  }

// Capitalize First Letter of String
function capitalizeFirstLetter(string) {
  return string.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}