'use client';

import { MessageCard } from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/model/User';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Copy, Loader2, RefreshCcw } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema';

function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]); // difining data type for messages, which is an array of Message objects
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { toast } = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  }; // by this we are updating at the ui level, not in the db. 

  const { data: session } = useSession(); // docs syntax

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema), // this schema is used to validate the acceptMessages switch state, defined in src/schemas/acceptMessageSchema.ts
  });

  const { register, watch, setValue } = form; // all things stored inside form.  
  const acceptMessages = watch('acceptMessages'); // you have to inject this watch, kis cheez ko watch karne waala hu. 

  const fetchAcceptMessages = useCallback(async () => { // useCallback is used to memoize the function, so it doesn't change on every render, which is useful for performance optimization.
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setValue('acceptMessages', response.data.isAcceptingMessages || false); // setting the value of acceptMessages switch based on the response from the server on ui, with fallback to false
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to fetch message settings',
        variant: 'destructive',
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>('/api/get-messages');
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: 'Refreshed Messages',
            description: 'Showing latest messages',
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: 'Error',
          description:
            axiosError.response?.data.message ?? 'Failed to fetch messages',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages, toast]
  );

  // Fetch initial state from the server
  useEffect(() => {
    if (!session || !session.user) return; 

    fetchMessages();

    fetchAcceptMessages();
  }, [session, setValue, toast, fetchAcceptMessages, fetchMessages]);

  // Handle switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages,
      });
      setValue('acceptMessages', !acceptMessages);
      toast({
        title: response.data.message,
        variant: 'default',
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to update message settings',
        variant: 'destructive',
      });
    }
  };

  if (!session || !session.user) {
    return <div></div>;
  }

  const { username } = session.user as User;

  // as this a client component, we can access window object to get the base URL of the application
  const baseUrl = `${window.location.protocol}//${window.location.host}`; // http or https + host name
  // Construct the profile URL using the base URL and username
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: 'URL Copied!',
      description: 'Profile URL has been copied to clipboard.',
    });
  };

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white dark:bg-gray-800 rounded w-full max-w-6xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <h1 className="text-4xl font-bold mb-6 text-black dark:text-white">User Dashboard</h1>

      <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
        <h2 className="text-lg font-semibold mb-3 text-black dark:text-white">Copy Your Unique Link</h2>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm"
          />
          <Button 
            onClick={copyToClipboard}
            className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 px-4 py-3"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
        </div>
      </div>

      <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-black dark:text-white mb-1">Accept Messages</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Allow others to send you anonymous messages</p>
          </div>
          <div className="flex items-center space-x-3">
            {isSwitchLoading && (
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            )}
            <Switch
              {...register('acceptMessages')}
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
            />
          </div>
        </div>
      </div>

      <Separator className="my-6 bg-gray-200 dark:bg-gray-700" />

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-black dark:text-white">Your Messages</h2>
        <Button
          className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 flex items-center gap-2"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id as string || index}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">No messages to display.</p>
            <Button
              onClick={copyToClipboard}
              className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
            >
              <Copy className="w-4 h-4 mr-2" />
              Share Your Link
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;