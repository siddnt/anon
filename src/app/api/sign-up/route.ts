// db connection in each route required
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();
    
    // Debug: Log the received data
    console.log('Received signup data:', { username, email, password: '***' });
    console.log('Request headers:', request.headers);

    const existingVerifiedUserByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUserByUsername) {
      console.log('Username already taken:', username);
      return Response.json(
        {
          success: false, // cz your registration is not successful
          message: 'Username is already taken',
        },
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: 'User already exists with this email',
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000); // Set expiry to 1 hour from now
        
        console.log('Updating existing user:', existingUserByEmail.email);
        await existingUserByEmail.save(); 
        console.log('Existing user updated with new verification code');
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1); // Set expiry to 1 hour from now

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });

      console.log('About to save new user:', { username, email, verifyCode });
      const savedUser = await newUser.save();
      console.log('User saved successfully with ID:', savedUser._id);
      console.log('User data:', {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        isVerified: savedUser.isVerified,
        verifyCode: savedUser.verifyCode,
        verifyCodeExpiry: savedUser.verifyCodeExpiry
      });
    }

    // Send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: 'User registered successfully. Please verify your account.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering user:', error); // this console log will be diplayed in terminal, cz this is server side code
    return Response.json( // and this response is sent to frontend. 
      {
        success: false,
        message: 'Error registering user',
      },
      { status: 500 }
    );
  }
}