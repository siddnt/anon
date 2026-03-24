import mongoose from "mongoose";
import { Schema, Document } from "mongoose"; // document is imported also , cz now we are using typescript

// now whenver we use ts, we define types - for that we use interface
export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new mongoose.Schema({
  content: {
    type: String, // mongoose string in capital letter but in typescript we use string in small letter
    required: true,
  },
  createdAt: {
    type: Date, // by the use of type safety is , if you would type anything other than date, it will throw an error, cz above you have defined it as Date. 
    required: true,
    default: Date.now,
  },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  messages: Message[];
  profileImage: string;
}

// Updated User schema
const UserSchema: Schema<User> = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/.+\@.+\..+/, 'Please use a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  verifyCode: {
    type: String,
    required: [true, 'Verify Code is required'],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, 'Verify Code Expiry is required'],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessages: {
    type: Boolean,
    default: true,
  },
  profileImage: {
    type: String,
    default: '',
  },
  messages: [MessageSchema],
});
// in our normal express backend, once our server starts, it keeps running , just one time intialization, but that doesnot happen in nextjs, nextjs runs on edge, so it does not know weather my applictaion is booting up for first tiume or it is already booted up previously, that is why exporting way is different
const UserModel =
  (mongoose.models.User as mongoose.Model<User>) || // here return type should be User, this is what we are checking here, using ts, SO the return model type should be User, not anything generic
  mongoose.model<User>('User', UserSchema); // here also we are passing datatype - <User> in between, this is interface we created above, so that we can use typescript features like type safety, intellisense, etc.
// if the model already exists, use it, otherwise create a new one

export default UserModel;