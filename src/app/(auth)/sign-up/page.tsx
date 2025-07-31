'use client';

import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDebounceValue } from 'usehooks-ts';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signUpSchema';

export default function SignUpForm() {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debouncedUsername] = useDebounceValue(username, 300);
// The useDebounceValue hook in your sign-up form is a performance optimization technique that prevents excessive API calls by delaying the execution of a function until a user has stopped typing.
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signUpSchema>>({ // type type insertion is optional, but it helps to ensure type safety
    resolver: zodResolver(signUpSchema), // this is sytax, what ar the checks we want to do, on what basis we want to validate the data
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
    mode: 'onChange', // This ensures form validation happens on every change
  }); // this is react-hook-form's useForm hook, which initializes the form with default values and sets up validation using zod

  useEffect(() => { // This effect runs whenever debouncedUsername changes, not username directly, which helps to avoid unnecessary API calls while the user is typing. OG bhai OG. and checks if the username is unique by making an API call to the server.
    const checkUsernameUnique = async () => {
      if (debouncedUsername) {
        setIsCheckingUsername(true);
        setUsernameMessage(''); // Reset message
        try {
          const response = await axios.get<ApiResponse>( // print this response in console to see the data structure
            `/api/check-username-unique?username=${debouncedUsername}`
          ); // url is made by appending the username to the endpoint, according to the API route defined in `src/app/api/check-username-unique/route.ts`
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;// casting the error to AxiosError to access response data
          setUsernameMessage(
            axiosError.response?.data.message ?? 'Error checking username'
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [debouncedUsername]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true); // so that we can disable the button while the form is being submitted
    
    // Debug: Log the data being sent
    console.log('Form data being sent:', data);
    console.log('Username state:', username);
    
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data); // try printing this data in console to see the data structure
      console.log('Sign-up response:', response.data);

      toast({
        title: 'Success',
        description: response.data.message,
      });

      router.replace(`/verify/${username}`); // so our strategy is to redirect the user to the verify page after successful sign-up, where they can enter the verification code sent to their email using hitting the API route `/api/verify-email` to verify their email address, and as it required the username, we are passing it in the URL

      setIsSubmitting(false); // Reset the submitting state so the button can be clicked again
    } catch (error) {
      console.error('Error during sign-up:', error);
      console.error('Full error object:', JSON.stringify(error, null, 2));

      const axiosError = error as AxiosError<ApiResponse>;

      // Default error message
      const errorMessage = axiosError.response?.data.message || 
        'There was a problem with your sign-up. Please try again.';

      toast({
        title: 'Sign Up Failed',
        description: errorMessage,
        variant: 'destructive',
      });

      setIsSubmitting(false); // Reset the submitting state so the button can be clicked again
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen py-12 px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            Create Account
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Join our anonymous feedback platform</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6"> {/* handleSubmit is a function provided by react-hook-form that handles the form submission and validation  and we calling our onSubmit function here */}
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Username</FormLabel>
                  <Input
                    {...field}
                    value={field.value || ''} // Ensure controlled component
                    className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-black dark:focus:border-white focus:ring-black dark:focus:ring-white"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const value = e.target.value;
                      field.onChange(value);
                      setUsername(value);
                    }}
                  />
                  {isCheckingUsername && <Loader2 className="animate-spin text-black dark:text-white" />}
                  {!isCheckingUsername && usernameMessage && (
                    <p
                      className={`text-sm ${
                        usernameMessage === 'Username is unique'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Email</FormLabel>
                  <Input 
                    {...field} 
                    value={field.value || ''} 
                    className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-black dark:focus:border-white focus:ring-black dark:focus:ring-white"
                  />
                  <p className='text-gray-500 dark:text-gray-400 text-sm'>We will send you a verification code</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Password</FormLabel>
                  <Input 
                    type="password" 
                    {...field} 
                    value={field.value || ''} 
                    className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-black dark:focus:border-white focus:ring-black dark:focus:ring-white"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className='w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 py-3 rounded-lg font-medium transition-colors' 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-6">
          <p className="text-gray-600 dark:text-gray-400">
            Already a member?{' '}
            <Link href="/sign-in" className="text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300 font-medium underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
