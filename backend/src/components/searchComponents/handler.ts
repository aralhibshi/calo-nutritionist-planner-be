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
    // Prisma - Search Ingredients
    const result = await searchComponents(searchName);
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

// Prisma - Search Ingredients
async function searchComponents(index) {
  try {
    console.log('Fetching components');

    const result = await prisma.component.findMany({
      where: {
        name: {
          search: index,
        },
      },
    });

    console.log('Components fetched successfully', result);
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: {
          title: 'Success',
          message: 'Components fetched successfully',
        },
        data: result,
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