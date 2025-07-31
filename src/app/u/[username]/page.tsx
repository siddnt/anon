'use client';

import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, MessageSquare, Send, Sparkles, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const router = useRouter();
  const username = params.username;

  const [suggestedMessages, setSuggestedMessages] = useState<string>(initialMessageString);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValidatingUser, setIsValidatingUser] = useState(true);

  // Validate user exists and is verified
  useEffect(() => {
    const validateUser = async () => {
      try {
        const response = await axios.get(`/api/validate-user?username=${username}`);
        if (!response.data.success) {
          router.push('/');
          return;
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        // 404 means user not found or not verified - redirect to home
        if (axiosError.response?.status === 404 || axiosError.response?.status === 400) {
          router.push('/');
        } else {
          // For other errors, also redirect but log for debugging
          console.error('User validation failed:', error);
          router.push('/');
        }
      } finally {
        setIsValidatingUser(false);
      }
    };

    if (username) {
      validateUser();
    }
  }, [username, router]);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: '', // Provide default empty string
    },
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      });

      toast({
        title: response.data.message,
        variant: 'default',
      });
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to sent message',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    setIsSuggestLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/suggest-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const suggestions = await response.text();
      setSuggestedMessages(suggestions);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to fetch suggestions');
      // Use fallback suggestions
      setSuggestedMessages(initialMessageString);
    } finally {
      setIsSuggestLoading(false);
    }
  };

  // Show loading while validating user
  if (isValidatingUser) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-600 dark:text-gray-400" />
          <p className="text-gray-600 dark:text-gray-400">Validating user...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-4">
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full">
                <User className="h-12 w-12 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black dark:text-white">
              Send Message to
            </h1>
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-2xl md:text-3xl font-bold">
              @{username}
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg">
              Share your thoughts anonymously and honestly
            </p>
          </div>

          {/* Message Form */}
          <Card className="mb-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <MessageSquare className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-black dark:text-white">Anonymous Message</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400">Your identity will remain completely private</p>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-medium text-black dark:text-white">
                          Your Message
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Write your anonymous message here... Be honest, be kind."
                            className="min-h-[120px] resize-none border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-blue-500 dark:focus:border-blue-400"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-center">
                    {isLoading ? (
                      <Button disabled className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sending...
                      </Button>
                    ) : (
                      <Button 
                        type="submit" 
                        disabled={isLoading || !messageContent}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 text-lg font-medium"
                      >
                        <Send className="mr-2 h-5 w-5" />
                        Send Message
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Suggested Messages Section */}
          <Card className="mb-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                  <h3 className="text-xl font-semibold text-black dark:text-white">Suggested Messages</h3>
                </div>
                <Button
                  onClick={fetchSuggestedMessages}
                  disabled={isSuggestLoading}
                  variant="outline"
                  className="border-gray-300 dark:border-gray-600 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {isSuggestLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Get New Ideas
                </Button>
              </div>
              <p className="text-gray-600 dark:text-gray-400">Click on any message below to use it as a starting point</p>
            </CardHeader>
            <CardContent>
              {error ? (
                <div className="text-center py-8">
                  <p className="text-red-500 dark:text-red-400 text-lg">{error}</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {parseStringMessages(suggestedMessages).map((message, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="text-left h-auto p-4 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200"
                      onClick={() => handleMessageClick(message)}
                    >
                      <div className="flex items-start gap-3">
                        <MessageSquare className="h-4 w-4 mt-1 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                        <span className="text-sm leading-relaxed">{message}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Separator className="my-8 bg-gray-200 dark:bg-gray-700" />

          {/* Call to Action */}
          <div className="text-center py-8">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold mb-4 text-black dark:text-white">
                Want Your Own Anonymous Message Board?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
                Create your account and start receiving honest feedback from friends, colleagues, and more!
              </p>
              <Link href="/sign-up">
                <Button className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 px-8 py-3 text-lg font-medium">
                  <User className="mr-2 h-5 w-5" />
                  Create Your Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}