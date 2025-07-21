import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'หวยไทย - Thailand Lottery | Official Lottery Tickets',
  description: 'Browse Thailand lottery tickets, check winning numbers and prizes. ตรวจหวย เลขหวยไทย ผลรางวัล',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
