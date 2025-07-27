import NextAuth from 'next-auth/next';
import { authOptions } from './options';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; // in these files, no method  name workds ,cz framework it is. we write verbs - GET, POST, etc. and it will automatically handle the request based on the method used in the request