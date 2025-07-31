'use client'

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { useTheme } from '@/context/ThemeProvider';

function Navbar() {
  const { data: session } = useSession();
  const { theme, toggleTheme, mounted } = useTheme();
  const user = session?.user;

  return (
    <nav className="p-4 md:p-6 shadow-md bg-white dark:bg-gray-900 text-black dark:text-white border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link href="/" className="text-xl font-bold mb-4 md:mb-0 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          Anon
        </Link>
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <Button
            onClick={toggleTheme}
            variant="outline"
            size="sm"
            className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
            suppressHydrationWarning
          >
            {mounted && theme === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>
          
          {session ? (
            <>
              <span className="mr-2 text-sm">
                Welcome, {user?.username || user?.email}
              </span>
              <Button 
                onClick={() => signOut()} 
                className="w-full md:w-auto bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button className="w-full md:w-auto bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;