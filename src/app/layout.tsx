import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '../context/AuthProvider';
import { ThemeProvider } from '../context/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import ThemeScript from '@/components/ThemeScript';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Anon',
  description: 'Anonymous feedback platform for honest communication.',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-gray-900 text-black dark:text-white transition-colors`} suppressHydrationWarning>
        <ThemeScript />
        <AuthProvider>
          <ThemeProvider>
            {children}
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
// This layout wraps the entire application with the AuthProvider, which provides authentication context to all components.
// The Toaster component is included to show notifications throughout the app.