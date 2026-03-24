'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { signInSchema } from '@/schemas/signInSchema';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function SignInForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const { toast } = useToast();
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    setIsSubmitting(false);

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
    }

    if (result?.url) {
      router.replace('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-animated overflow-hidden relative p-4">
      {/* Back Button */}
      <Link
        href="/"
        className="absolute top-6 left-6 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-card text-text-main hover:text-primary transition-colors flex items-center justify-center z-20"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
      </Link>

      {/* Floating decorative elements */}
      <div className="absolute top-[20%] left-[15%] w-32 h-32 bg-white/20 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '4s' }}></div>
      <div className="absolute bottom-[20%] right-[15%] w-40 h-40 bg-white/20 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>

      {/* Sign In Card */}
      <main className="w-full max-w-[440px] relative z-10">
        <div className="bg-white rounded-[32px] shadow-card p-8 sm:p-10 relative overflow-hidden">
          {/* Accent bar */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>

          {/* Header */}
          <div className="text-center mb-8 mt-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-5">
              <span className="text-3xl">👋</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-text-main leading-tight">Welcome back, you!</h1>
            <p className="text-text-muted mt-2 font-medium text-sm">Ready to see your messages?</p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="relative input-plush rounded-full">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" /></svg>
                      </div>
                      <input
                        {...field}
                        className="w-full h-14 bg-background-light rounded-full pl-11 pr-5 text-base font-medium text-text-main placeholder:text-text-muted/60 border-none focus:ring-2 focus:ring-primary/20 outline-none shadow-inner-soft"
                        placeholder="Username or Email"
                        type="text"
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="relative input-plush rounded-full">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                      </div>
                      <input
                        {...field}
                        className="w-full h-14 bg-background-light rounded-full pl-11 pr-5 text-base font-medium text-text-main placeholder:text-text-muted/60 border-none focus:ring-2 focus:ring-primary/20 outline-none shadow-inner-soft"
                        placeholder="Password"
                        type="password"
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <button
                className="w-full h-14 bg-primary text-white text-lg font-bold rounded-full shadow-plush flex items-center justify-center gap-2 btn-squish mt-2 disabled:opacity-60"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </Form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm font-medium text-text-muted">
              Don&apos;t have an account?{' '}
              <Link className="text-text-main font-bold hover:text-primary transition-colors" href="/sign-up">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}