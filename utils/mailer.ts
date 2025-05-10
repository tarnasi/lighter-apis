const enviroment = {
  MICROSOFT_CLIENT_ID: process.env.MICROSOFT_CLIENT_ID,
  MICROSOFT_CLIENT_SECRET: process.env.MICROSOFT_CLIENT_SECRET,
  MICROSOFT_TENANT_ID: process.env.MICROSOFT_TENANT_ID,
  MICROSOFT_SENDER_EMAIL: process.env.MICROSOFT_SENDER_EMAIL,
};

interface TokenResponse {
  token_type: string;
  expires_in: number;
  ext_expires_in: number;
  access_token: string; // Note: Usually snake_case from Microsoft
}

const fetchToken = async (): Promise<TokenResponse | undefined> => { // Return type annotation
  const url = `https://login.microsoftonline.com/${enviroment.MICROSOFT_TENANT_ID}/oauth2/v2.0/token`;

  if (!enviroment.MICROSOFT_CLIENT_ID || !enviroment.MICROSOFT_CLIENT_SECRET) {
    console.error('Missing required Microsoft credentials');
    throw new Error('Missing required Microsoft credentials'); // Throw to signal failure
  }

  const params = new URLSearchParams();
  params.append('client_id', enviroment.MICROSOFT_CLIENT_ID);
  params.append('client_secret', enviroment.MICROSOFT_CLIENT_SECRET);
  params.append('scope', 'https://graph.microsoft.com/.default'); // .default scope for client credentials
  params.append('grant_type', 'client_credentials');

  try {
    console.log("Attempting to fetch token from:", url);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(), // Use toString() for URLSearchParams
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`HTTP error! status: ${response.status}`, errorBody);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse the JSON response
    const data: TokenResponse = await response.json();
    console.log('Successfully fetched token data.'); // Don't log the token itself ideally
    return data;

  } catch (error) {
    console.error('Error fetching token:', error);
    // Depending on requirements, you might want to re-throw the error
    // or return undefined/null to indicate failure.
    // For now, letting the error propagate up (as caught below)
    throw error; // Re-throw the error to be caught by the caller
  }
};

async function sendGraphApiEmail(accessToken: string, recipientEmail: string, otp: string) {
  // --- Configuration ---
  const senderUserId = 'leifur@drilliphant.com'; // The user sending the email
  const apiUrl = `https://graph.microsoft.com/v1.0/users/${senderUserId}/sendMail`;

  // --- Email Data ---
  const emailData = {
    message: {
      subject: 'OTP Verification',
      body: {
        contentType: 'HTML',
        content: `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>OTP Verification</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      </head>
      <body class="bg-gray-100 text-gray-800">
        <div class="max-w-md mx-auto my-10 bg-white p-8 rounded-2xl shadow-lg">
          <div class="text-center">
            <h2 class="text-2xl font-bold text-indigo-600">🔐 OTP Verification</h2>
            <p class="mt-2 text-sm text-gray-600">Use the code below to verify your email address.</p>
          </div>

          <div class="mt-6 text-center">
            <p class="text-lg">Your OTP code is:</p>
            <p class="mt-2 text-3xl font-bold tracking-widest text-indigo-700">${otp}</p>
            <p class="mt-4 text-sm text-gray-500">This code will expire in 3 minutes.</p>
          </div>

          <hr class="my-6 border-gray-200" />

          <p class="text-xs text-gray-400 text-center">
            If you didn’t request this code, you can safely ignore this email.
          </p>
        </div>
      </body>
    </html>
    `,
      },
      toRecipients: [
        {
          emailAddress: {
            address: recipientEmail,
          },
        },
      ],
    },
  };

  // --- Fetch Options ---
  const fetchOptions = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(emailData), // Convert the JS object to a JSON string
  };

  // --- Make the API Call ---
  console.log(`Sending email via Graph API to ${recipientEmail}...`);

  try {
    const response = await fetch(apiUrl, fetchOptions);

    // Check if the request was successful (SendMail returns 202 Accepted)
    if (response.ok) {
      console.log(`Successfully sent email. Status: ${response.status} ${response.statusText}`);
      // SendMail usually returns 202 Accepted with no body content
    } else {
      // If there was an error, try to parse the response body for details
      let errorBody = await response.text(); // Read as text first
      let errorJson = null;
      try {
        errorJson = JSON.parse(errorBody); // Try parsing as JSON
      } catch (e) {
        // Ignore if body is not JSON
      }

      console.error(`Error sending email. Status: ${response.status} ${response.statusText}`);
      console.error('Error response body:', errorJson || errorBody); // Log JSON if available, otherwise text
    }
  } catch (error) {
    console.error('Failed to make fetch request:', error);
  }
}

export const sendOtpEmail = async (to: string, otp: string) => {
  try {
    console.log("Fetching access token...");
    const tokenData = await fetchToken(); // Changed variable name for clarity

    // Check if tokenData was successfully fetched
    if (tokenData && tokenData.access_token) {
       console.log("Access token obtained. Sending email...");
       // *** FIX: Use the correct property name 'access_token' ***
       await sendGraphApiEmail(tokenData.access_token, to, otp);
    } else {
       console.error("Failed to obtain access token. Cannot send email.");
       // Handle the case where the token couldn't be fetched
       // Maybe throw an error or return a failure status
    }

  } catch (error) {
    // Catch errors from fetchToken or sendGraphApiEmail
    console.error('Error in sendOtpEmail process:', error);
    // Handle the overall failure, maybe re-throw or return a specific error state
  }
};
