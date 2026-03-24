'use client';

import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDebounceValue } from 'usehooks-ts';
import * as z from 'zod';

import {
  Form,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
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

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (debouncedUsername) {
        setIsCheckingUsername(true);
        setUsernameMessage('');
        try {
          const response = await axios.get<ApiResponse>(
            `/api/check-username-unique?username=${debouncedUsername}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
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
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data);
      toast({
        title: 'Success',
        description: response.data.message,
      });
      router.replace(`/verify/${username}`);
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error during sign-up:', error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message ||
        'There was a problem with your sign-up. Please try again.';
      toast({
        title: 'Sign Up Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 text-text-main bg-gradient-animated overflow-hidden">
      {/* Main Card */}
      <main className="w-full max-w-[440px] bg-white rounded-[32px] shadow-card p-8 sm:p-10 relative overflow-hidden flex flex-col gap-6">
        {/* Header */}
        <header className="text-center space-y-2">
          <h1 className="text-3xl sm:text-[36px] font-bold tracking-tight text-text-main leading-tight">
            Let&apos;s get you in!
          </h1>
          <p className="text-text-muted font-medium">
            Join the fun. No weird vibes allowed.
          </p>
        </header>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {/* Username */}
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <input
                    {...field}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      field.onChange(e);
                      setUsername(e.target.value);
                    }}
                    className="input-soft w-full h-14 rounded-full bg-background-light border-none focus:ring-2 focus:ring-primary/20 text-text-main text-base font-medium px-5 placeholder:text-text-muted/60 outline-none"
                    placeholder="Pick a cool username..."
                    type="text"
                    autoComplete="off"
                  />
                  {isCheckingUsername && <Loader2 className="animate-spin mt-2 ml-2 text-primary" size={16} />}
                  {!isCheckingUsername && usernameMessage && (
                    <p className={`text-xs ml-3 mt-1 font-medium ${usernameMessage === 'Username is unique'
                        ? 'text-green-500'
                        : 'text-primary'
                      }`}>
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <input
                    {...field}
                    className="input-soft w-full h-14 rounded-full bg-background-light border-none focus:ring-2 focus:ring-primary/20 text-text-main text-base font-medium px-5 placeholder:text-text-muted/60 outline-none"
                    placeholder="Your email address..."
                    type="email"
                  />
                  <p className="text-text-muted text-xs ml-3 mt-1 font-medium">We&apos;ll send you a verification code</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <input
                    {...field}
                    className="input-soft w-full h-14 rounded-full bg-background-light border-none focus:ring-2 focus:ring-primary/20 text-text-main text-base font-medium px-5 placeholder:text-text-muted/60 outline-none"
                    placeholder="Create a password..."
                    type="password"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <button
              className="btn-squish w-full h-14 bg-primary hover:bg-primary-hover text-white rounded-full font-bold text-lg shadow-plush flex items-center justify-center disabled:opacity-60 mt-1"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Creating your vibe...</span>
                </div>
              ) : (
                'Start for Free'
              )}
            </button>
          </form>
        </Form>

        {/* Footer */}
        <footer className="text-center">
          <p className="text-text-muted font-medium text-sm">
            Already have an account?{' '}
            <Link className="text-text-main hover:text-primary transition-colors font-bold" href="/sign-in">
              Sign in
            </Link>
          </p>
        </footer>
      </main>
    </div>
  );
}
