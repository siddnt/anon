import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import mongoose from 'mongoose';

export async function DELETE(
  request: Request,
  context: { params: Promise<{ messageId: string }> }
) {
  const params = await context.params;
  const messageId = params.messageId;
  await dbConnect();

  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }

  try {
    const user = session.user;
    const userId = new mongoose.Types.ObjectId(user._id);

    // Find the user and remove the message with the given messageId
    const result = await UserModel.updateOne(
      { _id: userId },
      { $pull: { messages: { _id: messageId } } }
    );

    if (result.modifiedCount === 0) {
      return Response.json(
        { success: false, message: 'Message not found or already deleted' },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: 'Message deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting message:', error);
    return Response.json(
      { success: false, message: 'Error deleting message' },
      { status: 500 }
    );
  }
}
