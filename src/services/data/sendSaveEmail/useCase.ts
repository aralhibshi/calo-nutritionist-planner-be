import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { capitalizeFirstLetter } from 'src/utils/stringUtils';

// Send Email
export async function sendSaveEmail(
  entity: string,
  user_email: string,
  email_type: string,
  url: string,
  table_name: string
) {
  try {
    const client = new SESClient({
      region: 'us-east-1'
    });

    const emailBody = await generateEmailBody(entity, email_type, url);
    const emailSubject = await generateEmailSubject(entity, email_type, url);

    const params = {
      Destination: {
        // Can't send to unverified user_email because of AWS SES Sandbox :(
        // ToAddresses: [user_email],
        ToAddresses: [user_email],
      },
      Message: {
        Body: {
          Html: {
            Data: emailBody
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: emailSubject,
        },
      },
      Source: process.env.EMAIL_SOURCE!
    };

    const command = new SendEmailCommand(params);
    const result = await client.send(command);

    // Save Email to DynamoDB
    await saveEmailToDynamoDB(table_name, user_email, emailSubject, result)

    console.log('Email sent! Message ID:', result.MessageId);
    console.log('SendEmailCommand Response', result);
    return result;
  } catch (err) {
    console.error('Error sending email:', err);
  }
}

// Generate Email Body
async function generateEmailBody(entity: string, emailType: string, url?: string) {
  const capitalizedEntity = capitalizeFirstLetter(entity);

  if (emailType === 'welcome') {
    return `<p>Thank you for signing up and welcome to <strong>Calo</strong>! 💚</p>`;
  } else if (emailType === 'data-report' && url) {
    return `
      <p>Click <a href='${url}'>here</a> to download your requested data report for <strong>${capitalizedEntity}</strong>! 💚</p>
      <p><em>Please note the link will expire after 5 minutes...</em> 👀</p>
    `;
  }
}

// Generate Email Subject
async function generateEmailSubject(entity: string, emailType: string, url?: string) {
  const capitalizedEntity = capitalizeFirstLetter(entity);

  if (emailType === 'welcome') {
    return 'Nutritionist Planner - Welcome!';
  } else if (emailType === 'data-report' && url) {
    return `Nutritionist Planner - ${capitalizedEntity} Data Report`
  }
}

// Save to DynamoDB
async function saveEmailToDynamoDB(
  table_name: string,
  user_email: string,
  emailSubject: string | undefined,
  sendEmailResponse: any
) {
  const client = new DynamoDBClient({
    region: 'us-east-1'
  });
  const docClient = DynamoDBDocumentClient.from(client);
  const timestamp = new Date().toISOString();

  const command = new PutCommand({
    TableName: table_name,
    Item: {
      'pk': user_email,
      'sk': emailSubject,
      'response': JSON.stringify(sendEmailResponse),
      'sent_at': timestamp
    },
  });

  const response = await docClient.send(command);
  console.log(response);
  return response;
}