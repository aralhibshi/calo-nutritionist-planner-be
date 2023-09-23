import https from 'https';
import fetch from 'node-fetch';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { capitalizeFirstLetter } from 'src/utils/stringUtils';
import { jsonToCsv } from 'src/utils/conversionUtils';

// Presigned Put URL
export async function createPresignedPutUrlWithClient(
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
export async function createPresignedGetUrlWithClient(
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
    const objectKey = `${entity}/${user_id}.csv`;

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
async function processMeals(
  mealsData: any
): Promise<any> {
  try {
    const processedMeals: any[] = mealsData.map((meal: any) => {
      let totalFats = 0;
      let totalCarbs = 0;
      let totalProteins = 0;
      let totalCalories = 0;
      let totalPrice = 0;
      let totalQuantity = 0;

      meal.meals_components.forEach((mealComponent: any) => {
        const component = mealComponent.component;
        if (component && component.components_ingredients) {
          component.components_ingredients.forEach((el: any) => {
            const ingredient = el.ingredient;
            if (ingredient) {
              const ingredientQuantity = Number(el.ingredient_quantity);
              totalFats += Number(ingredient.fats) * ingredientQuantity;
              totalCarbs += Number(ingredient.carbs) * ingredientQuantity;
              totalProteins += Number(ingredient.protein) * ingredientQuantity;
              totalCalories +=
                (Number(ingredient.fats) + Number(ingredient.carbs) + Number(ingredient.protein)) * ingredientQuantity * 9;
              totalPrice += Number(ingredient.price) * ingredientQuantity;
              totalQuantity += ingredientQuantity;
            }
          });
        }
      });

      return {
        id: meal.id,
        name: meal.name,
        description: meal.description || null,
        price: totalPrice.toFixed(3),
        protein: (totalProteins / totalQuantity).toFixed(3),
        fats: (totalFats / totalQuantity).toFixed(3),
        carbs: (totalCarbs / totalQuantity).toFixed(3),
        calories: totalCalories.toFixed(3),
        unit: meal.unit,
        created_at: meal.created_at,
        updated_at: meal.updated_at,
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
      const ingredientQuantity = Number(ingredient.ingredient_quantity);
      const ingredientFats = Number(ingredient.ingredient.fats);
      const ingredientCarbs = Number(ingredient.ingredient.carbs);
      const ingredientProtein = Number(ingredient.ingredient.protein);
      const ingredientPrice = Number(ingredient.ingredient.price);

      totalFats += ingredientFats * ingredientQuantity;
      totalCarbs += ingredientCarbs * ingredientQuantity;
      totalProteins += ingredientProtein * ingredientQuantity;
      totalCalories +=
        (ingredientFats + ingredientCarbs + ingredientProtein) *
        ingredientQuantity *
        9;
      totalPrice += ingredientPrice * ingredientQuantity;
      totalQuantity += ingredientQuantity;
    });

    const processedComponents = [
      {
        id: componentData.id,
        name: componentData.name,
        category: componentData.category,
        description: componentData.description || null,
        price: totalPrice.toFixed(3),
        protein: (totalProteins / totalQuantity).toFixed(3),
        fats: (totalFats / totalQuantity).toFixed(3),
        carbs: (totalCarbs / totalQuantity).toFixed(3),
        calories: totalCalories.toFixed(3),
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