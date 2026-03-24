 import { getServerSession } from 'next-auth/next'; // this require auth options to be passed, which is defined in the options file, so we import it from there below
import { authOptions } from '../auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User'; 

export async function POST(request: Request) {
  // Connect to the database
  await dbConnect();

  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }
  
  const user = session.user; // as injected many things inside the session if you remeber, so we just taking user from there. and we also defined the type of user as User from next-auth.

  const userId = user._id;
  const { acceptMessages } = await request.json(); // fontend boi flag for toggle

  try {
    // Update the user's message acceptance status
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId, 
      { isAcceptingMessages: acceptMessages },
      { new: true } //The object { new: true } is commonly used as an option in MongoDB queries with Mongoose, a popular ODM (Object Data Modeling) library for Node.js. When passed to methods like findOneAndUpdate, this option tells Mongoose to return the updated document rather than the original document before the update.
    );

    if (!updatedUser) {
      // User not found
      return Response.json(
        {
          success: false,
          message: 'Unable to find user to update message acceptance status',
        },
        { status: 404 }
      );
    }

    // Successfully updated message acceptance status
    return Response.json(
      {
        success: true,
        message: 'Message acceptance status updated successfully',
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating message acceptance status:', error);
    return Response.json(
      { success: false, message: 'Error updating message acceptance status' },
      { status: 500 }
    );
  }
}


export async function GET() {
  // Connect to the database
  await dbConnect();

  // Get the user session
  const session = await getServerSession(authOptions);
  const user = session?.user;

  // Check if the user is authenticated
  if (!session || !user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    // Retrieve the user from the database using the ID
    const foundUser = await UserModel.findById(user._id);

    if (!foundUser) {
      // User not found
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Return the user's message acceptance status
    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error retrieving message acceptance status:', error);
    return Response.json(
      { success: false, message: 'Error retrieving message acceptance status' },
      { status: 500 }
    );
  }
}