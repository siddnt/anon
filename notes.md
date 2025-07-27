here , in models we made schemas for our mongodb models   but inside schemas we are making validation schemas using zod.
these all created for doing. verification or checks easily using zod.

--------
3
bcz  of being edge time framework, this applicatoin made from next js do not run all time , jaise jaise user ki request aati hai tab excute hota hai. and also the functions that you write in next js run on time. 
but in pure backend things keep running all the time.

so now db is not connected all the time, it is connected only when the request comes. now what if you made 2 consecutinve requests, and in second requ, may be there exist already connection with db, this way you will take many db connections, so always next if db connected, it will not create new connection, it will use the existing one.
----------

now diff between nextauth package and core mongoose mthod of saving user in db, cz this nextauth is good but that is quite starddized , they just have limited fields(like email, password, name) and you can not add more fields to it, so people often do not use that for signup bcz generally we take more fields in signup, but in signin , all people just take 2 fields(email, password), so we use it there.

also we are taking username, email, pass, otp. 
<!-- 
code should effectively handles both scenarios of registering a new user and updating an existing but unverified user account with a new password and verification code.
IF existingUserByEmail EXISTS THEN
    IF existingUserByEmail.isVerified THEN
        success: false, // User already exists and is verified
    ELSE
        // Save the updated user // Update the existing user with new password and verification code
    END IF
ELSE
    // Create a new user with the provided details
    // Save the new user
END IF

-->
----------
now NEXT AUTH course
-- there are some namings or folder and file structures that you need to be aware of when working with NextAuth.js
-- NextAuth.js is typically placed in the `src/api/auth/[...nextauth].ts` file
-- You can customize the authentication providers, callbacks, and session management in this file
------------

(auth) --- when you  write like this, you are bascially grouping all the auth related files in a folder called auth, and then you can write your own custom logic inside that folder, like you can write your own custom sign-in page, or you can write your own custom sign-up page, etc. and auth naam se route nhi hoga , cz uske saaame paranthesses lage hain

now nextauth good thing is that it also create a ui for you, but it will not be shown without making a file called `sign-in.tsx` in the `src/app/auth` folder, so you still have to create that file, but you can use the default UI provided by NextAuth.js or you can create your own custom UI. you get client api 