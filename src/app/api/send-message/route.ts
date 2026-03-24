import UserModel from '@/model/User';
import dbConnect from '@/lib/dbConnect';
import { Message } from '@/model/User';

export async function POST(request: Request) {
  await dbConnect();
  const { username, content } = await request.json();

  try {
    const user = await UserModel.findOne({ username }).exec();

    if (!user) {
      return Response.json(
        { message: 'User not found', success: false },
        { status: 404 }
      );
    }

    // Check if the user is accepting messages
    if (!user.isAcceptingMessages) {
      return Response.json(
        { message: 'User is not accepting messages', success: false },
        { status: 403 } // 403 Forbidden status
      );
    }

    const newMessage = { content, createdAt: new Date() };

    // Push the new message to the user's messages array
    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      { message: 'Message sent successfully', success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding message:', error);
    return Response.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}

  /*
  Does Mongoose query work without .exec()?

  Yes, it usually works without `.exec()` as well.
  Mongoose queries like `UserModel.findOne({ username })` return a thenable object, so you can use `await` or `.then()` directly.

  However, using `.exec()` is recommended for clarity and consistency, especially in complex queries or when chaining multiple query helpers.
  It guarantees you get a real Promise and avoids subtle bugs in some edge cases.

  Summary:
  - `await UserModel.findOne({ username })` works.
  - `await UserModel.findOne({ username }).exec()` is the recommended, explicit way.
  Both will return the user document.
  */