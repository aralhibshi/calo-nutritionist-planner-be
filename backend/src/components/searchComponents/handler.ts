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

    // Prisma - Search Components
    const result = await searchComponents(capitalizedSearchName);
    return result;
    }
  } catch (err) {
    console.log('Error', err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: {
          title: 'Error',
          message: 'Error fetching components',
          details: err,
        },
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
});

// Prisma - Search Components
async function searchComponents(index) {
  try {
    console.log('Fetching components');

    const result = await prisma.component.findMany({
      where: {
        name: {
          contains: index,
        },
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

    console.log('Components fetched successfully', sortedResults);
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: {
          title: 'Success',
          message: 'Components fetched successfully',
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
          message: 'Error fetching matching components in Prisma',
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