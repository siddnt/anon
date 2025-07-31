'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail, Shield, Users, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface Message {
  title: string;
  content: string;
  received: string;
}

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-white dark:bg-gray-900 text-black dark:text-white">
        
        {/* Main Hero Content */}
        <section className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-black dark:text-white mb-6">
            Anonymous Feedback Platform
          </h1>
          <p className="mt-4 md:mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Share honest feedback anonymously. Receive genuine insights without revealing your identity. 
            Build trust through transparent communication.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button asChild size="lg" className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 px-8 py-3">
              <Link href="/sign-up">
                <MessageCircle className="mr-2 h-5 w-5" />
                Get Started
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-gray-400 dark:border-gray-600 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-8 py-3">
              <Link href="/sign-in">
                Sign In
              </Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
          <div className="text-center p-6">
            <Shield className="h-12 w-12 text-black dark:text-white mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-black dark:text-white">100% Anonymous</h3>
            <p className="text-gray-600 dark:text-gray-400">Your identity stays completely private. Share feedback without fear.</p>
          </div>
          <div className="text-center p-6">
            <Users className="h-12 w-12 text-black dark:text-white mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-black dark:text-white">Build Trust</h3>
            <p className="text-gray-600 dark:text-gray-400">Foster honest communication in teams, relationships, and communities.</p>
          </div>
          <div className="text-center p-6">
            <Mail className="h-12 w-12 text-black dark:text-white mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-black dark:text-white">Easy Sharing</h3>
            <p className="text-gray-600 dark:text-gray-400">Share your unique link and start receiving anonymous messages instantly.</p>
          </div>
        </section>

        {/* Sample Messages Carousel */}
        <section className="w-full max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-black dark:text-white">
            See What People Are Sharing
          </h2>
          <Carousel
            plugins={[Autoplay({ delay: 3000 })]}
            className="w-full max-w-2xl mx-auto"
          >
            <CarouselContent>
              {messages.map((message: Message, index: number) => (
                <CarouselItem key={index} className="p-4">
                  <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-black dark:text-white flex items-center gap-2">
                        <Mail className="h-5 w-5 text-black dark:text-white" />
                        {message.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{message.content}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Received {message.received}
                      </p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex border-gray-300 dark:border-gray-600 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800" />
            <CarouselNext className="hidden md:flex border-gray-300 dark:border-gray-600 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800" />
          </Carousel>
        </section>

        {/* How It Works Section */}
        <section className="max-w-4xl mx-auto mt-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-black dark:text-white">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="w-12 h-12 bg-black dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">Sign Up</h3>
              <p className="text-gray-600 dark:text-gray-400">Create your account and get your unique anonymous feedback link.</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-black dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">Share Your Link</h3>
              <p className="text-gray-600 dark:text-gray-400">Share your link with friends, colleagues, or on social media.</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">Receive Feedback</h3>
              <p className="text-gray-600 dark:text-gray-400">Get honest, anonymous messages and insights from others.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center p-6 md:p-8 bg-gray-100 dark:bg-gray-900 text-black dark:text-white border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            © 2025 Anonymous Feedback Platform. All rights reserved.
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <span className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer">
              Privacy Policy
            </span>
            <span className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer">
              Terms of Service
            </span>
            <span className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer">
              Contact
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}