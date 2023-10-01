import https from 'https';
import fetch from 'node-fetch';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { capitalizeFirstLetter } from 'src/utils/stringUtils';
import { jsonToCsv } from 'src/utils/conversionUtils';
import { getISOString } from 'src/utils/conversionUtils';

// Presigned Put URL
async function createPresignedPutUrlWithClient(
  entity: string,
  user_id: string,
  bucket: string,
  key: string
): Promise<string> {
  try {
    const client = new S3Client({
      region: 'us-east-1'
    });

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Metadata: {
        'x-amz-meta-entity': capitalizeFirstLetter(entity),
        'x-amz-meta-user': user_id,
        'x-amz-meta-date-iso': new Date().toISOString()
      }
    });

    const url = await getSignedUrl(client, command, { expiresIn: 120 });
    return url;
  } catch (err) {
    console.log('Error creating pre-signed PUT Url', err);
    throw err;
  }
}

// Presigned Get URL
async function createPresignedGetUrlWithClient(
  bucket: string,
  key: string,
  entity: string,
): Promise<string> {
  try {
    const capitalizedEntity = capitalizeFirstLetter(entity);
    const date = getISOString();

    const client = new S3Client({
      region: 'us-east-1'
    });

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
      ResponseContentType: 'text/csv',
      ResponseContentDisposition: `attachment; filename=${capitalizedEntity}-${date}.csv`,
      ResponseCacheControl: 'No-cache'
    });

    const url = await getSignedUrl(client, command, { expiresIn: 300 });
    return url;
  } catch (err) {
    console.log('Error creating presigned GET Url', err);
    throw err;
  }
}

// Create Urls
export async function createUrls(
  entity: string,
  user_id: string
) {
  try {
    const bucket = process.env.BUCKET_NAME!;
    const date = getISOString();
  
    const objectKey = `${entity}/${user_id}_${date}.csv`;

    const putUrl = await createPresignedPutUrlWithClient(entity, user_id, bucket, objectKey);
    const getUrl = await createPresignedGetUrlWithClient(bucket, objectKey, entity);

    return { putUrl, getUrl };
  } catch (err) {
    console.log('Error creating urls', err);
  }
}

// Put Object
export async function putObject(
  url: string,
  data: any,
): Promise<any> {
  try {
    const convertedData = jsonToCsv(data)

    return new Promise((resolve, reject) => {
      const contentLength = Buffer.byteLength(convertedData, 'utf-8');
      const req = https.request(
        url,
        {
          method: 'PUT',
          headers: {
            'Content-Length': contentLength,
            'Content-Type': 'text/csv'
          }
        },
        (res) => {
          let responseBody = '';
          res.on('data', (chunk) => {
            responseBody += chunk;
          });
          res.on('end', () => {
            resolve(responseBody);
          });
        }
      );
      req.on('error', (err) => {
        reject(err);
      });
      req.write(convertedData);
      req.end();
    });
  } catch (err) {
    console.log('Error putting object into bucket', err)
  }
}

// Fetch Entity Data
export async function fetchData(
  entity: string,
  skip: number,
  take: number
): Promise<any> {
  try {
    const baseUrl = process.env.BASE_URL!;
    const url = `${baseUrl}${entity}?skip=${skip}&take=${take}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const responseData: any = await response.json();

    if (entity === 'meals') {
      console.log(JSON.stringify(responseData.data.meals));
      return await processMeals(responseData.data.meals);
    } else if (entity === 'components') {
      return await processComponents(responseData.data.components);
    } else if (entity === 'ingredients') {
      console.log(responseData.data.ingredients);
      return await processIngredients(responseData.data.ingredients);
    }
  } catch (err) {
    console.log('Error fetching data', err)
  }
}

// Send Message to SQS
export async function sendMessageToSQS(
  entity: string,
  user_email: string,
  email_type: string,
  url: string,
) {
  try {
    const client = new SQSClient({
      region: 'us-east-1',
    });

    const params = {
      QueueUrl: process.env.SQS_QUEUE_URL!,
      MessageBody: JSON.stringify({
        entity,
        user_email,
        email_type,
        url
      }),
    };

    const command = new SendMessageCommand(params);
    const result = await client.send(command);
    console.log('Message sent to SQS:', result.MessageId);
  } catch (error) {
    console.error('Error sending message to SQS:', error);
    throw error;
  }
}

// Process Meals
async function processMeals(
  mealsData: any
): Promise<any> {
  try {
    const processedMeals: any[] = mealsData.map((meal: any) => {
      let totalCalories = 0;
      let totalProteins = 0;
      let totalCarbs = 0;
      let totalFats = 0;
      let totalPrice = 0;
      let totalQuantity = 0;

      meal.meals_components.forEach((mealComponent: any) => {
        const component = mealComponent.component;
        const quantity = Number(mealComponent.component_quantity);

        if (component && component.components_ingredients) {
          component.components_ingredients.forEach((el: any) => {
            const ingredient = el.ingredient;
            if (ingredient) {
              totalFats += Number(el.ingredient.fats * el.ingredient_quantity);
              totalCarbs += Number(el.ingredient.carbs * el.ingredient_quantity);
              totalProteins += Number(el.ingredient.protein * el.ingredient_quantity);
              totalPrice += Number(el.ingredient.price * el.ingredient_quantity);

              totalQuantity += Number(el.ingredient_quantity);
            }
          });
          totalProteins /= totalQuantity
          totalCarbs /= totalQuantity
          totalFats /= totalQuantity
          totalPrice /= totalQuantity

          totalProteins += Number(
            (totalProteins * quantity).toFixed(3)
          );
          totalCarbs += Number((totalCarbs * quantity).toFixed(3));
          totalFats += Number((totalFats * quantity).toFixed(3));
          totalPrice += Number((totalPrice * quantity).toFixed(3));

          totalCalories =
          (totalFats * 9 + totalCarbs * 4 + totalProteins * 4)
        }
      });
      
      // Ingredient Names
      const ingredients = meal.meals_components
      .map((mealComponent: any) =>
        mealComponent.component.components_ingredients.map((el: any) => el.ingredient.name)
      )
      .join(', ');

      // Component Names
      const components = meal.meals_components
      .map((mealComponent: any) => mealComponent.component.name)
      .join(', ');

      return {
        // id: meal.id,
        name: meal.name,
        description: meal.description || null,
        calories: Number(totalCalories.toFixed(3)),
        protein: Number(totalProteins.toFixed(3)),
        carbs: Number(totalCarbs.toFixed(3)),
        fats: Number(totalFats.toFixed(3)),
        grams: Number(totalQuantity.toFixed(3)),
        unit: meal.unit,
        price: Number(totalPrice.toFixed(3)),
        // created_at: meal.created_at,
        // updated_at: meal.updated_at,
        ingredients,
        components,
      };
    });

    console.log('Processed Meals', processedMeals);
    return {
      data: {
        meals: processedMeals
      }
    };
  } catch (err) {
    console.log('Error processing meals', err);
    throw err;
  }
}

// Process Components
async function processComponents(
  componentsData: any
): Promise<any> {
  try {
    const processedComponents: any[] = componentsData.map((component: any) => {
      let totalCalories = 0;
      let totalProteins = 0;
      let totalCarbs = 0;
      let totalFats = 0;
      let totalPrice = 0;


    component.components_ingredients.forEach((componentIngredient: any) => {
      const ingredient = componentIngredient.ingredient
      console.log(ingredient)

      totalProteins += Number(ingredient.protein);
      totalCarbs += Number(ingredient.carbs);
      totalFats += Number(ingredient.fats);
      totalPrice += Number(ingredient.price);
    });

    totalCalories = (totalProteins * 4) + (totalCarbs * 4) + (totalFats * 9);
    
    return  {
        // id: componentData.id,
        name: component.name,
        category: component.category,
        description: component.description || null,
        calories: Number(totalCalories.toFixed(3)),
        protein: Number(totalProteins.toFixed(3)),
        carbs: Number(totalCarbs.toFixed(3)),
        fats: Number(totalFats.toFixed(3)),
        unit: component.unit,
        price: Number(totalPrice.toFixed(3)),
        // created_at: componentData.created_at,
        // updated_at: componentData.updated_at,
      }
  });
  console.log('Processed Components', processedComponents);
  return {
    data: {
      components: processedComponents
    }
  };
  } catch (err) {
    console.log('Error processing component', err);
    throw err;
  }
}

// Process Ingredients
async function processIngredients(
  ingredientsData: any
): Promise<any> {
  try {
    console.log(ingredientsData);

    const processedIngredients: any[] = ingredientsData.map((ingredient: any) => {
      const totalCalories = (ingredient.protein * 4) + (ingredient.carbs * 4) + (ingredient.fats * 9);

      return {
        // id: ingredient.id,
        name: ingredient.name,
        category: ingredient.category,
        description: ingredient.description || null,
        calories: Number(totalCalories.toFixed(3)),
        protein: Number(ingredient.protein),
        carbs: Number(ingredient.carbs),
        fats: Number(ingredient.fats),
        unit: ingredient.unit,
        price: Number(ingredient.price),
        // created_at: componentData.created_at,
        // updated_at: componentData.updated_at,
      }
  });
  return {
    data: {
      ingredients: processedIngredients
    }
  };
  } catch (err) {
    console.log('Error proccessing ingredients', err);
    throw err;
  }
}