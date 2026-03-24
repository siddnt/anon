'use client'

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <nav className="w-full bg-background-light/80 backdrop-blur-md sticky top-0 z-50 border-b border-[#f4e8e7]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="size-7 text-primary">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" fill="currentColor"></path>
              </svg>
            </div>
            <span className="text-text-main text-xl font-black tracking-tight">VibeCheck</span>
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-6">
            {session ? (
              <>
                <span className="text-text-main font-medium hidden sm:block">
                  Hey, {user?.username || user?.email} 👋
                </span>
                <Link href="/dashboard">
                  <button className="flex items-center justify-center rounded-full h-10 px-6 bg-primary text-white text-sm font-bold tracking-wide hover:bg-primary-hover transition-colors btn-squish">
                    Dashboard
                  </button>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center justify-center rounded-full h-10 px-6 bg-white border-2 border-gray-200 text-text-main text-sm font-bold hover:border-primary hover:text-primary transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <div className="hidden md:flex items-center gap-8">
                  <a className="text-text-main text-sm font-bold hover:text-primary transition-colors" href="#features">Features</a>
                  <a className="text-text-main text-sm font-bold hover:text-primary transition-colors" href="#how-it-works">How it Works</a>
                </div>
                <Link href="/sign-in">
                  <button className="flex items-center justify-center rounded-full h-10 px-6 bg-white border-2 border-primary text-primary text-sm font-bold hover:bg-primary hover:text-white transition-colors">
                    Sign In
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;