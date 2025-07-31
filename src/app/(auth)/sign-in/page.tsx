// signup was manual things , now in sign in we have used next-auth, so this would be bit differetnt and short. 
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn, useSession } from 'next-auth/react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { signInSchema } from '@/schemas/signInSchema';
import { useEffect, useState } from 'react';

export default function SignInForm() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If user is already authenticated, redirect to dashboard
  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.replace('/dashboard');
    }
  }, [session, status, router]);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
    mode: 'onChange',
  });

  const { toast } = useToast();
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    try {
      const result = await signIn('credentials', { // this signIn function is provided by next-auth, which handles the sign-in process, now no need of axios or api calls. 
        redirect: false, // we don't want to redirect immediately, we want to handle it ourselves
        identifier: data.identifier, // identifier can be either email or username, so we use the same field for both, we already handled this on backend. 
        password: data.password,
      });

      if (result?.error) {
        if (result.error === 'CredentialsSignin') {
          toast({
            title: 'Login Failed',
            description: 'Incorrect username or password',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Error',
            description: result.error,
            variant: 'destructive',
          });
        }
      } else if (result?.ok) {
        // If sign-in was successful, redirect to dashboard
        toast({
          title: 'Success',
          description: 'Signed in successfully',
        });
        // Use window.location for a hard redirect to ensure state refresh
        window.location.href = '/dashboard';
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen py-12 px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Sign in to continue your anonymous conversations</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Email/Username</FormLabel>
                  <Input 
                    {...field} 
                    value={field.value || ''} 
                    className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-black dark:focus:border-white focus:ring-black dark:focus:ring-white"
                  />
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
              className='w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 py-3 rounded-lg font-medium transition-colors' 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-6">
          <p className="text-gray-600 dark:text-gray-400">
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300 font-medium underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}