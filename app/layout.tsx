import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import Navbar from '@/components/Navbar';
import WelcomeModal from '@/components/WelcomeModal';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair'
});

export const metadata: Metadata = {
  title: "Sukhi's Wellness",
  description: 'A black-and-gold personal wellness dashboard for Sukhi Pathansaly.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <Navbar />
        <main className="min-h-screen animate-page-in bg-transparent">{children}</main>
        <WelcomeModal />
      </body>
    </html>
  );
}
