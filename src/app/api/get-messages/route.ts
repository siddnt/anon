// doing monogodb aggereagation pipelines to get the messages, cz it is an array there, although you can directly dumpt whole array, but it is not a good practice, so we will use mongoose aggregation pipelines to get the messages, it is fast.

   import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import mongoose from 'mongoose';
import { User } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../(auth)/[...nextauth]/options';

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const _user: User = session?.user; // actully we converted the user to string in the session, so we need to convert it back to object, so we can use it here.
  // if you remember, we injected the user in the session, so we can use it.

  if (!session || !_user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }
  const userId = new mongoose.Types.ObjectId(_user._id); // so here we are converting the user id to mongoose object id, so we can use it in the query. this is needed in aggreation pipelines, although string can be used in normal queries(find by id, and update etc), but not in aggregation pipelines.
  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: '$messages' }, // unwind the messages array to get each message as a separate document or object
      { $sort: { 'messages.createdAt': -1 } },
      { $group: { _id: '$_id', messages: { $push: '$messages' } } },
    ]).exec();   

    if (!user || user.length === 0) {
      return Response.json(
        { message: 'User not found', success: false },
        { status: 404 }
      );
    }

    return Response.json(
      { messages: user[0].messages },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return Response.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}