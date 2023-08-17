import { PrismaClient } from '@prisma/client';
import { middyfy } from '@lib/middleware';

const prisma = new PrismaClient();

export default middyfy(async (event) => {
  try {
    console.log('Received CloudFormation Event:', JSON.stringify(event, null, 2));

    const searchName = event.queryStringParameters && event.queryStringParameters.name;

    if (!searchName) {
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
      const capitalizedSearchName = capitalizeFirstLetter(searchName)

    // Prisma - Search Ingredients
    const result = await searchMeals(capitalizedSearchName);
    return result;
    }
  } catch (err) {
    console.log('Error', err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: {
          title: 'Error',
          message: 'Error fetching meals',
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
async function searchMeals(index) {
  try {
    console.log('Fetching meals');

    const result = await prisma.meal.findMany({
      where: {
        name: {
          contains: index,
        },
      },
      orderBy: {
        name: 'asc', // You can choose any field for the initial ordering
      },
    });
    
     // Manually sort the results based on exact match priority
     const sortedResults = result.sort((a, b) => {
      if (a.name === index && b.name !== index) {
        return -1;
      } else if (a.name !== index && b.name === index) {
        return 1;
      } else {
        return 0;
      }
    });

    console.log('Meals fetched successfully', sortedResults);
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: {
          title: 'Success',
          message: 'Meals fetched successfully',
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
          message: 'Error fetching matching meals in Prisma',
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