'use client';

import { MessageCard } from '@/components/MessageCard';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/model/User';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw, Copy, Share2, Settings, Inbox, Upload } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema';
import Image from 'next/image';

function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setValue('acceptMessages', response.data.isAcceptingMessages || false);
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

  const fetchProfileImage = useCallback(async () => {
    try {
      const response = await axios.get('/api/profile-image');
      if (response.data.profileImage) {
        setProfileImage(response.data.profileImage);
      }
    } catch {
      // No profile image set yet, that's fine
    }
  }, []);

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessages();
    fetchProfileImage();
  }, [session, setValue, toast, fetchAcceptMessages, fetchMessages, fetchProfileImage]);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Max 5MB', variant: 'destructive' });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('/api/upload-profile-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProfileImage(response.data.imageUrl);
      toast({ title: 'Profile picture updated!' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Upload failed',
        description: axiosError.response?.data.message ?? 'Try again',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (!session || !session.user) {
    return <div></div>;
  }

  const { username } = session.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    toast({
      title: 'URL Copied!',
      description: 'Profile URL has been copied to clipboard.',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-background-light min-h-screen flex flex-col md:flex-row overflow-x-hidden">
      {/* Sidebar */}
      <aside className="w-full md:w-[260px] md:min-h-screen bg-white border-r border-gray-100 flex flex-col shrink-0">
        <div className="p-5 flex flex-col h-full gap-6">
          {/* Profile Section */}
          <div className="flex items-center gap-3">
            <div
              className="relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {profileImage ? (
                <Image
                  src={profileImage}
                  alt="Profile"
                  width={44}
                  height={44}
                  className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-primary/20 to-accent-blue/20 flex items-center justify-center text-xl border-2 border-white shadow-sm">
                  {username?.charAt(0)?.toUpperCase() || '?'}
                </div>
              )}
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                {isUploading ? (
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 text-white" />
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
            <div className="min-w-0">
              <h1 className="font-bold text-base text-text-main leading-none mb-0.5 truncate">
                {username}
              </h1>
              <p className="text-xs text-text-muted font-medium">Free Plan</p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-col gap-1">
            <a className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-primary/10 text-primary font-semibold text-sm" href="#">
              <Inbox size={18} />
              Inbox
            </a>
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-text-main hover:bg-gray-50 font-medium text-sm transition-colors cursor-pointer">
              <Settings size={18} />
              <span>Accept Messages</span>
              <div className="ml-auto">
                <Switch
                  {...register('acceptMessages')}
                  checked={acceptMessages}
                  onCheckedChange={handleSwitchChange}
                  disabled={isSwitchLoading}
                />
              </div>
            </div>
          </nav>

          {/* Link Share */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Your Link</h3>
            <div className="bg-white rounded-xl px-3 py-2.5 mb-3 shadow-inner-soft border border-gray-100 flex items-center justify-between gap-2">
              <span className="text-text-main font-medium truncate text-xs">{profileUrl.replace(/^https?:\/\//, '')}</span>
              <Copy size={14} className="text-text-muted shrink-0" />
            </div>
            <button
              onClick={copyToClipboard}
              className="btn-squish w-full bg-primary hover:bg-primary-hover text-white font-bold text-sm py-2.5 px-4 rounded-full shadow-plush flex items-center justify-center gap-2 transition-all"
            >
              <Share2 size={15} />
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-5 md:p-8 lg:p-10 overflow-y-auto w-full max-w-[1100px] mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
          <div>
            <h2 className="font-extrabold text-2xl md:text-3xl text-text-main tracking-tight mb-1">
              Your Messages
            </h2>
            <p className="text-text-muted font-medium text-sm">
              {messages.length > 0
                ? `${messages.length} anonymous note${messages.length > 1 ? 's' : ''} waiting for you.`
                : 'No messages yet. Share your link!'}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-gray-100 text-text-main font-semibold text-sm hover:bg-gray-50 transition-colors self-start"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
            Refresh
          </button>
        </header>

        {/* Message Grid */}
        {messages.length > 0 ? (
          <div className="masonry-grid">
            {messages.map((message, index) => (
              <div key={message._id as string || index} className="masonry-item">
                <MessageCard
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[350px] text-center max-w-sm mx-auto">
            <div className="w-16 h-16 mb-5 rounded-full bg-primary/10 flex items-center justify-center text-3xl">
              📭
            </div>
            <h3 className="font-bold text-xl text-text-main mb-2">It&apos;s quiet...</h3>
            <p className="text-text-muted text-sm font-medium mb-6">Share your link on your socials to get the party started!</p>
            <button
              onClick={copyToClipboard}
              className="btn-squish bg-primary text-white font-bold text-sm py-2.5 px-6 rounded-full shadow-plush flex items-center gap-2"
            >
              <Share2 size={16} />
              Share Link Now
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default UserDashboard;