
'use client'

import React from 'react';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Message } from '@/model/User';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { ApiResponse } from '@/types/ApiResponse';

dayjs.extend(relativeTime);

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

const cardEmojis = ['🤫', '👻', '🦊', '🌟', '💬', '✨', '🎭', '🔮'];
const cardGradients = [
  'from-blue-100 to-purple-100',
  'from-green-100 to-emerald-100',
  'from-yellow-100 to-orange-100',
  'from-pink-100 to-rose-100',
  'from-cyan-100 to-blue-100',
  'from-violet-100 to-purple-100',
];

export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const { toast } = useToast();

  const styleIndex = message._id
    ? (message._id as string).charCodeAt(0) % cardGradients.length
    : 0;
  const emojiIndex = message._id
    ? (message._id as string).charCodeAt(1) % cardEmojis.length
    : 0;

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast({
        title: response.data.message,
      });
      onMessageDelete(message._id as string);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to delete message',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="message-card bg-white rounded-2xl p-5 shadow-card border border-gray-50 relative group cursor-pointer flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${cardGradients[styleIndex]} flex items-center justify-center text-lg`}>
          {cardEmojis[emojiIndex]}
        </div>
        <span className="text-xs font-semibold text-text-muted bg-gray-50 px-2.5 py-1 rounded-full">
          {dayjs(message.createdAt).fromNow()}
        </span>
      </div>

      {/* Message Content */}
      <p className="text-base text-text-main font-medium leading-relaxed mb-4 flex-grow">
        &ldquo;{message.content}&rdquo;
      </p>

      {/* Hover Actions */}
      <div className="message-actions mt-auto pt-3 border-t border-gray-50 flex items-center">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="w-full bg-gray-50 hover:bg-red-50 hover:text-primary text-text-muted font-semibold py-2 px-4 rounded-xl text-sm transition-colors flex items-center justify-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
              Delete
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete
                this message.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-full">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm} className="rounded-full bg-primary hover:bg-primary-hover">
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}