// here i am gonna modify some existing data types for next-auth
// this is a special declaration file.
import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    // so i am modifying the session and user types, which are defined interfaces in next-auth, to include more of my custom properties
  interface Session {
    user: {
      _id?: string;
      isVerified?: boolean;
      isAcceptingMessages?: boolean;
      username?: string;
    } & DefaultSession['user'];
  }

  interface User {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
  }
}
// alternatively, you can also use the `declare module` syntax to extend the JWT type
// this is useful if you want to add custom properties to the JWT token that NextAuth.js.
declare module 'next-auth/jwt' {
  interface JWT {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
  }
}