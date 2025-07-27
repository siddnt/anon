import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({ // you can write multiple providers here, like google, github, etc
      // this is the credentials provider, which allows you to authenticate users with email and password
      // you can also use username and password, but in this case we are using email and password
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any): Promise<any> { // this is our custorm - CredentailProvider, so we have to write this authorize function, which will be called when the user tries to sign in with email and password, else if it was google or github, then it would have called the respective provider's authorize function, and next-auth would have handled it automatically. 
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [ // Match by email or username
              { email: credentials.identifier.email },
              { username: credentials.identifier.username },
            ],
          }); // query karo, leke aao user ko. 
          if (!user) {
            throw new Error('No user found with this email');
          }
          if (!user.isVerified) {
            throw new Error('Please verify your account before logging in');
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error('Incorrect password');
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
  ],
  callbacks: {
    // now to now doing db call eveytime, we need more data to be stored, so i modified the callbacks. so what info i taken user, i shifted it to token and then whateven info i got from token later, i shifted it to session, so that i can use it in my frontend, like user._id, user.isVerified, etc.
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString(); // Convert ObjectId to string, withhout defining it as string, it will throw an error, so we did include modification in next-auth.d.ts. cz this user is coming from the authorize function above
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt', // Use JWT for session management, you can also use database sessions, means you are having some key stored in db and on the basis of that key you are authenticating the user.
  },
  secret: process.env.NEXTAUTH_SECRET,
  // next js direct pages by defalut come by doing /auth, but i want direct sign-in, so i have override the default p ages
  pages: {
    signIn: '/sign-in', // when you write this route, now you do not have to even design this page, NextAuth.js will automatically create a sign-in page for you
  },
};