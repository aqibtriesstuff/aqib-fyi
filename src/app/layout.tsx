import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Sans, Space_Mono } from 'next/font/google';
import './tokens.css';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'aqib.fyi',
  description: 'A living illustrated world. The story of who Aqib is.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fontVars = `${cormorant.variable} ${dmSans.variable} ${spaceMono.variable}`;
  return (
    <html lang="en" className={fontVars}>
      <body>{children}</body>
    </html>
  );
}
