import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        { success: false, message: 'Username is required' },
        { status: 400 }
      );
    }

    // Find user by username and check if verified
    const user = await UserModel.findOne({ 
      username: username,
      isVerified: true 
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found or not verified' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User is valid and verified'
    });

  } catch (error) {
    console.error('Error validating user:', error);
    return NextResponse.json(
      { success: false, message: 'Error validating user' },
      { status: 500 }
    );
  }
}