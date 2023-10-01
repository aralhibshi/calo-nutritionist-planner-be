import https from 'https';
import fetch from 'node-fetch';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { capitalizeFirstLetter } from 'src/utils/stringUtils';
import { jsonToCsv } from 'src/utils/conversionUtils';

// Presigned Put URL
async function createPresignedPutUrlWithClient(
  bucket: string,
  key: string
): Promise<string> {
  try {
    const client = new S3Client({
      region: 'us-east-1'
    });

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key
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
    const capitalizedEntity = capitalizeFirstLetter(entity)

    const client = new S3Client({
      region: 'us-east-1'
    });

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
      ResponseContentType: 'text/csv',
      ResponseContentDisposition: `attachment; filename=${capitalizedEntity}.csv`,
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
    const date = new Date().toISOString();
    const objectKey = `${entity}/${user_id}_${date}.csv`;

    const putUrl = await createPresignedPutUrlWithClient(bucket, objectKey);
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
      return await responseData;
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
async function processMeals(mealsData: any): Promise<any> {
  try {
    const processedMeals: any[] = mealsData.map((meal: any) => {
      let totalFats = 0;
      let totalCarbs = 0;
      let totalProteins = 0;
      let totalPrice = 0;
      let totalQuantity = 0;

      meal.meals_components.forEach((mealComponent: any) => {
        const component = mealComponent.component;
        const componentQuantity = Number(mealComponent.component_quantity);

        if (component && component.components_ingredients) {
          component.components_ingredients.forEach((el: any) => {
            const ingredient = el.ingredient;
            if (ingredient) {
              const ingredientQuantity = Number(el.ingredient_quantity);
              totalFats += ingredient.fats * ingredientQuantity * componentQuantity;
              totalCarbs += ingredient.carbs * ingredientQuantity * componentQuantity;
              totalProteins += ingredient.protein * ingredientQuantity * componentQuantity;
              totalPrice += ingredient.price * ingredientQuantity * componentQuantity;
              totalQuantity += ingredientQuantity * componentQuantity;
            }
          });
        }
      });

      const totalCalories = (totalFats * 9) + (totalCarbs * 4) + (totalProteins * 4);
      
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
        price: Number(totalPrice.toFixed(3)),
        protein: Number(totalProteins.toFixed(3)),
        fats: Number(totalFats.toFixed(3)),
        carbs: Number(totalCarbs.toFixed(3)),
        calories: Number(totalCalories.toFixed(3)),
        unit: meal.unit,
        // created_at: meal.created_at,
        // updated_at: meal.updated_at,
        grams: Number(totalQuantity.toFixed(3)),
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
  componentData: any
): Promise<any> {
  try {
    let totalFats = 0;
    let totalCarbs = 0;
    let totalProteins = 0;
    let totalCalories = 0;
    let totalPrice = 0;
    let totalQuantity = 0;

    console.log(componentData);

    componentData.components_ingredients.forEach((ingredient: any) => {
      totalFats += Number(ingredient.ingredient.fats);
      totalCarbs += Number(ingredient.ingredient.carbs);
      totalProteins += Number(ingredient.ingredient.protein);
      totalPrice += Number(ingredient.ingredient.price);
      totalQuantity += Number(ingredient.ingredient_quantity);
    });

    totalCalories = Number((totalProteins*4)+(totalCarbs*4)+(totalFats*9))

    const processedComponents = [
      {
        id: componentData.id,
        name: componentData.name,
        category: componentData.category,
        description: componentData.description || null,
        price: (totalPrice / totalQuantity).toFixed(3),
        protein: (totalProteins / totalQuantity).toFixed(3),
        fats: (totalFats / totalQuantity).toFixed(3),
        carbs: (totalCarbs / totalQuantity).toFixed(3),
        calories: (totalCalories / totalQuantity).toFixed(3),
        unit: componentData.unit,
        created_at: componentData.created_at,
        updated_at: componentData.updated_at,
      },
    ];

    console.log(processedComponents);
    return {
      data: {
        components: processedComponents,
      },
    };
  } catch (err) {
    console.log('Error processing component', err);
    throw err;
  }
}