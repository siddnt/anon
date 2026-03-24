'use client';

import {
  Form,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { verifySchema } from '@/schemas/verifySchema';

export default function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });

      toast({
        title: 'Success',
        description: response.data.message,
      });

      router.replace('/sign-in');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Verification Failed',
        description:
          axiosError.response?.data.message ??
          'An error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-animated overflow-hidden relative p-4">
      {/* Decorative blobs */}
      <div className="absolute top-[20%] left-[10%] w-40 h-40 bg-white/20 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '4s' }}></div>
      <div className="absolute bottom-[15%] right-[10%] w-48 h-48 bg-white/20 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>

      {/* Verify Card */}
      <main className="w-full max-w-[440px] relative z-10">
        <div className="bg-white rounded-[32px] shadow-card p-8 sm:p-10 relative overflow-hidden">
          {/* Accent bar */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>

          {/* Header */}
          <div className="text-center mb-8 mt-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-50 mb-5">
              <span className="text-3xl">✅</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-text-main leading-tight">
              Almost there!
            </h1>
            <p className="text-text-muted mt-2 font-medium text-sm">
              Enter the verification code sent to your email
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <FormField
                name="code"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <input
                      {...field}
                      className="w-full h-14 bg-background-light rounded-full px-5 text-xl font-bold text-text-main placeholder:text-text-muted/60 placeholder:font-medium placeholder:text-base border-none focus:ring-2 focus:ring-primary/20 outline-none shadow-inner-soft tracking-[0.3em] text-center"
                      placeholder="Enter code"
                      type="text"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <button
                className="w-full h-14 bg-primary text-white text-lg font-bold rounded-full shadow-plush flex items-center justify-center gap-2 btn-squish disabled:opacity-60"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  'Verify'
                )}
              </button>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
}