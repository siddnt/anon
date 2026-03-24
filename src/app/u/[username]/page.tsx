'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, Dice5, Send } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const [suggestedMessages, setSuggestedMessages] = useState<string>(initialMessageString);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
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
      setIsSent(true);
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
      setSuggestedMessages(initialMessageString);
    } finally {
      setIsSuggestLoading(false);
    }
  };

  const handleSendAnother = () => {
    setIsSent(false);
    form.reset({ content: '' });
  };

  return (
    <div className="bg-gradient-shift min-h-screen flex items-center justify-center p-4 text-text-main antialiased overflow-hidden">
      <div className="relative w-full max-w-lg perspective-1000">
        <div
          className={`relative w-full transition-transform duration-700 transform-style-3d ${isSent ? 'rotate-y-180' : ''}`}
          style={{ minHeight: '550px' }}
        >
          {/* ===== FRONT: Message Input ===== */}
          <div className="absolute inset-0 w-full bg-white rounded-2xl backface-hidden flex flex-col items-center pt-14 px-6 pb-6 border border-gray-100 shadow-card">
            {/* Avatar */}
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
              <div className="w-20 h-20 rounded-full border-4 border-white shadow-md bg-gradient-to-tr from-primary/20 to-accent-blue/20 flex items-center justify-center text-3xl">
                🤫
              </div>
            </div>

            {/* Prompt */}
            <h1 className="text-xl sm:text-2xl font-bold text-center mb-5 mt-1 text-text-main">
              Send {username} anonymous confessions...
            </h1>

            {/* Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex-grow flex flex-col gap-3">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-grow flex flex-col">
                      <FormControl>
                        <div className="relative w-full flex-grow flex flex-col bg-background-light rounded-xl shadow-inner-soft p-4 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20 transition-colors duration-300">
                          <textarea
                            {...field}
                            className="w-full h-full min-h-[160px] bg-transparent border-none resize-none focus:ring-0 text-base text-text-main placeholder-text-muted p-0 outline-none"
                            placeholder="Type something nice..."
                            spellCheck={false}
                          />
                          <div className="flex items-center justify-between mt-2">
                            <button
                              type="button"
                              onClick={fetchSuggestedMessages}
                              disabled={isSuggestLoading}
                              className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-text-muted hover:text-primary hover:shadow-md transition-all duration-300"
                            >
                              {isSuggestLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Dice5 size={18} />
                              )}
                            </button>
                            <span className="text-xs font-medium text-text-muted">Anonymous</span>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Suggested Messages */}
                {!error && (
                  <div className="flex flex-wrap gap-1.5">
                    {parseStringMessages(suggestedMessages).map((message, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleMessageClick(message)}
                        className="px-3 py-1.5 rounded-full bg-background-light text-text-main text-xs font-medium hover:bg-primary/10 hover:text-primary transition-colors border border-gray-100"
                      >
                        {message}
                      </button>
                    ))}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading || !messageContent}
                  className="w-full py-3.5 bg-primary text-white rounded-full font-bold text-base shadow-plush btn-squish disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Send It!
                      <Send size={16} />
                    </>
                  )}
                </button>
              </form>
            </Form>
          </div>

          {/* ===== BACK: Success State ===== */}
          <div className="absolute inset-0 w-full bg-white rounded-2xl backface-hidden rotate-y-180 flex flex-col items-center justify-center p-8 border border-gray-100 shadow-card text-center">
            <div className="w-20 h-20 mb-5 rounded-full bg-green-50 flex items-center justify-center text-5xl">
              ✅
            </div>
            <h2 className="text-2xl font-bold mb-3 text-text-main">Sent!</h2>
            <p className="text-base text-text-muted mb-8 font-medium">Want to get your own link?</p>

            <div className="flex flex-col gap-3 w-full max-w-xs">
              <Link
                href="/sign-up"
                className="w-full py-3.5 bg-text-main text-white rounded-full font-bold text-base text-center shadow-card btn-squish block"
              >
                Create your own page
              </Link>
              <button
                onClick={handleSendAnother}
                className="w-full py-3.5 bg-transparent text-text-muted hover:text-text-main rounded-full font-bold text-base text-center transition-colors"
              >
                Send another message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}