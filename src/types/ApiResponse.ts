import { Message } from "@/model/User";
// kis type se hamara response dikhna chaiya, this is what we will do in this file
// type definition using interface, 99% time we will use interface
export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean; // optional field, cz we do not need this in signup like things
  messages?: Array<Message> // optional field
};