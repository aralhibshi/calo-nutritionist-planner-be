import { PrismaClient } from '@prisma/client';
import { middyfy } from '@lib/middleware';

const prisma = new PrismaClient();

export default middyfy(async (event) => {
  try {
    console.log('Received CloudFormation Event:', JSON.stringify(event, null, 2));

    const ingredientName = event.queryStringParameters && event.queryStringParameters.name;

    if (!ingredientName) {
      console.log('Validation Error:', 'Missing or invalid query parameter "name"');
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: {
            title: 'Validation Error',
            message: 'Missing or invalid query parameter "name"',
          },
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    } else {
      const capitalizedIngredientName = capitalizeFirstLetter(ingredientName)

    // Prisma - Search Ingredients
    const result = await searchIngredients(capitalizedIngredientName);
    return result;
    }
  } catch (err) {
    console.log('Error', err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: {
          title: 'Error',
          message: 'Error fetching ingredients',
          details: err,
        },
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
});

// Prisma - Search Ingredients
async function searchIngredients(index) {
  try {
    console.log('Fetching ingredients');

    const result = await prisma.ingredient.findMany({
      where: {
        name: {
          contains: index,
        }
      },
      orderBy: {
        name: 'asc',
      },
    });
    
     const sortedResults = result.sort((a, b) => {
      if (a.name === index && b.name !== index) {
        return -1;
      } else if (a.name !== index && b.name === index) {
        return 1;
      } else {
        return 0;
      }
    });

    console.log('Ingredients fetched successfully', sortedResults);
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: {
          title: 'Success',
          message: 'Ingredients fetched successfully',
        },
        data: sortedResults,
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
          message: 'Error fetching matching ingredients in Prisma',
          details: err,
        },
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
}

// Capitalize First Letter of String
function capitalizeFirstLetter(string) {
  return string.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}