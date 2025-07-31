import Navbar from '@/components/Navbar';
import { Toaster } from '@/components/ui/toaster';

export default function UserProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
      <Toaster />
    </>
  );
}
