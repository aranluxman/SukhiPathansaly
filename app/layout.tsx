import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import WelcomeModal from '@/components/WelcomeModal';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap'
});

export const metadata: Metadata = {
  title: "Sukhi's Wellness",
  description: 'A personal wellness dashboard for Sukhi Pathansaly.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen bg-white animate-page-in">{children}</main>
        <WelcomeModal />
      </body>
    </html>
  );
}
