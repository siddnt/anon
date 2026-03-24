import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { z } from 'zod';
import { usernameValidation } from '@/schemas/signUpSchema';
// not wrtten more about this file. 
const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get('username'), // get the username from the query params
    };

    const result = UsernameQuerySchema.safeParse(queryParams);  // Validate the query parameters, by running it through zod schema
    // safeParse returns an object with success and data or error properties
    // if success is true, then data will contain the parsed data, else error will contain the validation errors

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || []; // if there are any errors in the username validation, then it will be present in the error object
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(', ')
              : 'Invalid query parameters',
        },
        { status: 400 }
      );
    }

    const { username } = result.data;

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: 'Username is already taken',
        },
        { status: 200 }
      );
    }

    return Response.json(
      {
        success: true,
        message: 'Username is unique',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking username:', error);
    return Response.json(
      {
        success: false,
        message: 'Error checking username',
      },
      { status: 500 }
    );
  }
}

/*
What is `request` parameter?

The `request` parameter is a **Web API Request object** that represents the incoming HTTP request to your API endpoint.

What is `request`?
- **Type:** Request (Web API standard)
- **Contains:** All information about the incoming HTTP request
- **Automatically provided:** Next.js passes this to your API route handler

What's Inside `request`?
The `request` object contains:

request.url        // Full URL: "http://localhost:3000/api/check-username-unique?username=alice"
request.method     // HTTP method: "GET", "POST", etc.
request.headers    // Request headers
request.body       // Request body (for POST/PUT requests)

How It's Used in Your Code:

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  //                                ^^^^^^^^^^^
  //                                This extracts the full URL from the request
}

Example:
- **Client calls:** GET /api/check-username-unique?username=alice
- **request.url:** "http://localhost:3000/api/check-username-unique?username=alice"
- **searchParams:** Allows you to extract username=alice

Where Does `request` Come From?
When someone makes an HTTP request to your API:

// Frontend code
fetch('/api/check-username-unique?username=alice')

Next.js automatically:
1. Creates a Request object with all the request info
2. Passes it to your GET function as the first parameter

In short:
`request` is the incoming HTTP request object that contains the URL, headers, body, and all other request data that Next.js automatically provides to your API route handler.
*/