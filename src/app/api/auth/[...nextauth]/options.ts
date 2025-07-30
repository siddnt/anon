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
        identifier: { label: 'Email/Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async authorize(credentials: Record<string, string> | undefined): Promise<any> { // this is our custorm - CredentailProvider, so we have to write this authorize function, which will be called when the user tries to sign in with email and password, else if it was google or github, then it would have called the respective provider's authorize function, and next-auth would have handled it automatically. 
        await dbConnect();
        try {
          console.log('NextAuth authorize called with:', { identifier: credentials?.identifier });
          
          if (!credentials?.identifier || !credentials?.password) {
            console.log('Missing credentials');
            return null;
          }
          
          const user = await UserModel.findOne({
            $or: [ // Match by email or username
              { email: credentials.identifier },
              { username: credentials.identifier }, // Allow login with email in username field
            ],
          }); // query karo, leke aao user ko. 
          
          console.log('User found:', user ? { username: user.username, email: user.email, isVerified: user.isVerified } : 'No user found');
          
          if (!user) {
            // No user found
            console.log('No user found for identifier:', credentials.identifier);
            return null;
          }
          if (!user.isVerified) {
            // Not verified
            console.log('User not verified:', user.username);
            return null;
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          
          console.log('Password check result:', isPasswordCorrect);
          
          if (isPasswordCorrect) {
            console.log('Authentication successful for user:', user.username);
            return user;
          } else {
            // Incorrect password
            console.log('Incorrect password for user:', user.username);
            return null;
          }
        } catch (err: unknown) {
          console.error('Authorize error:', err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // now to now doing db call eveytime, we need more data to be stored, so i modified the callbacks. so what info i taken user, i shifted it to token and then whateven info i got from token later, i shifted it to session, so that i can use it in my frontend, like user._id, user.isVerified, etc.
    async jwt({ token, user }) {
      if (user) {
        console.log('JWT callback - User from authorize:', { _id: user._id, username: user.username });
        token._id = user._id?.toString(); // Convert ObjectId to string, withhout defining it as string, it will throw an error, so we did include modification in next-auth.d.ts. cz this user is coming from the authorize function above
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
        console.log('JWT callback - Token after user inject:', { _id: token._id, username: token.username });
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        console.log('Session callback - Token received:', { _id: token._id, username: token.username });
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
        console.log('Session callback - Final session user:', { _id: session.user._id, username: session.user.username });
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