import { PrismaClient } from '@prisma/client';
import { middyfy } from '@lib/middleware';

const prisma = new PrismaClient();

export default middyfy(async () => {
  try {
    // await prisma.ingredient.deleteMany()

    const ingredient = await prisma.ingredient.create({
      data: {
        name: 'cool af White Rice',
        description: 'more rice',
        price: 0.0227,
        calories: 0.25,
        protein: 0.23,
        fats: 0.22,
        carbs: 0.42,
        unit: 'g',
      },
    });

    console.log(ingredient);

    return {
      statusCode: 201,
      body: {
        message: 'Ingredient Created',
        ingredient,
      },
    };
  } catch (err) {
    console.log(err);

    return {
      statusCode: 500,
      body: {
        error: {
          title: 'Prisma Error',
          message: 'Error creating ingredient',
          details: err.message,
        },
      },
    };
  }
});



// import { PrismaClient } from '@prisma/client';
// import { middyfy } from '@lib/middleware';

// const prisma = new PrismaClient();

// export default middyfy(async (event) => {
//   try {
//     const ingredientData = JSON.parse(event.body);

//     const ingredient = await prisma.ingredient.create({
//       data: ingredientData,
//     });

//     console.log(ingredient);

//     return {
//       statusCode: 201,
//       body: {
//         message: 'Ingredient Created',
//         ingredient,
//       },
//     };
//   } catch (err) {
//     console.log(err);

//     return {
//       statusCode: 500,
//       body: {
//         error: {
//           title: 'Prisma Error',
//           message: 'Error creating ingredient',
//           details: err.message,
//         },
//       },
//     };
//   }
// });