import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { capitalizeFirstLetter } from 'src/utils/stringUtils';

// Send Email
export async function sendEmail(
  entity: string,
  user_email: string,
  email_type: string,
  url: string
) {
  try {
    const client = new SESClient({
      region: 'us-east-1'
    });

    const emailBody = await generateEmailBody(entity, email_type, url);

    const params = {
      Destination: {
        // Can't send to unverified user_email because of AWS SES Sandbox :(
        // ToAddresses: [user_email],
        ToAddresses: [process.env.EMAIL_SOURCE!],
      },
      Message: {
        Body: {
          Html: {
            Data: emailBody
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: 'Calo - Nutritionist Planner',
        },
      },
      Source: process.env.EMAIL_SOURCE!
    };

    const command = new SendEmailCommand(params);
    const result = await client.send(command);
    console.log('Email sent! Message ID:', result.MessageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

// Generate Email Body
async function generateEmailBody(entity: string, emailType: string, url?: string) {
  const capitalizedEntity = capitalizeFirstLetter(entity);

  if (emailType === 'welcome') {
    return `<p>Thank you for signing up and welcome to <strong>Calo</strong>! 💚</p>`;
  } else if (emailType === 'data-report' && url) {
    return `
      <p>Click <a href="${url}">here</a> to download your requested data report for <strong>${capitalizedEntity}</strong>! 💚</p>
      <p><em>Please note the link will expire after 5 minutes...</em> 👀</p>
    `;
  }
}

// Save to DynamoDB