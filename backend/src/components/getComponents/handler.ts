import { PrismaClient } from '@prisma/client';
import { middyfy } from '@lib/middleware';

const prisma = new PrismaClient();

export default middyfy(async (event) => {
  try {
    console.log('Received CloudFormation Event:', JSON.stringify(event, null, 2));

    // Prisma - Get Components
    const result = await getComponents();
    return result;
  } catch (err) {
    console.log('Error', err)
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: {
          title: 'Error',
          message: 'Error fetching components',
          details: err
        }
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  }
})

// Prisma - Get Components
async function getComponents() {
  try {
    console.log('Fetching components');

    const result = await prisma.component.findMany();

    console.log('Components fetched successfully', result);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: {
          title: 'Success',
          message: 'Component fetched successfully'
        },
        data: result
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    };
  } catch (err) {
    console.log('Prisma Error:', err)
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: {
          title: 'Prisma Error',
          message: 'Error fetching Components in Prisma',
          details: err
        }
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  }
}