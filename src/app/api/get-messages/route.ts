// doing monogodb aggereagation pipelines to get the messages, cz it is an array there, although you can directly dumpt whole array, but it is not a good practice, so we will use mongoose aggregation pipelines to get the messages, it is fast.

   import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }
  
  const _user = session.user; // actully we converted the user to string in the session, so we need to convert it back to object, so we can use it here.
  // if you remember, we injected the user in the session, so we can use it.

  console.log('Session user:', _user);
  console.log('User ID:', _user._id);

  if (!_user._id) {
    return Response.json(
      { success: false, message: 'User ID not found in session' },
      { status: 400 }
    );
  }

  const userId = new mongoose.Types.ObjectId(_user._id); // so here we are converting the user id to mongoose object id, so we can use it in the query. this is needed in aggreation pipelines, although string can be used in normal queries(find by id, and update etc), but not in aggregation pipelines.
  console.log('Converted userId:', userId);
  try {
    console.log('Finding user by ID:', userId);
    
    const user = await UserModel.findById(userId);
    
    console.log('User found:', user ? { _id: user._id, username: user.username, messagesLength: user.messages?.length } : 'No user found');

    if (!user) {
      return Response.json(
        { message: 'User not found', success: false },
        { status: 404 }
      );
    }

    // Get messages and sort them by creation date (newest first)
    const messages = user.messages || [];
    const sortedMessages = messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    console.log('Returning messages:', sortedMessages.length, 'messages found');

    return Response.json(
      { messages: sortedMessages },
      { status: 200 }
    );
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return Response.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}