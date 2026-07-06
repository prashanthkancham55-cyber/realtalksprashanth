import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'RealTalks Prashanth | Corporate Trainer, Sales Trainer & Leadership Coach',
  description:
    'Prashanth is a world-class corporate trainer, sales coach and leadership expert with 9+ years of experience training 25,000+ professionals. Book a free discovery call today.',
  keywords: [
    'corporate trainer',
    'sales trainer',
    'leadership coach',
    'motivational speaker',
    'RealTalks Prashanth',
    'business growth',
    'sales training India',
  ],
  authors: [{ name: 'Prashanth', url: 'https://www.realtalksprashanth.in' }],
  openGraph: {
    title: 'RealTalks Prashanth | Transform Your Team. Transform Your Business.',
    description:
      'Corporate Trainer • Sales Trainer • Leadership Coach • Motivational Speaker. 9+ years, 25,000+ professionals trained.',
    url: 'https://www.realtalksprashanth.in',
    siteName: 'RealTalks Prashanth',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RealTalks Prashanth | Corporate Trainer & Leadership Coach',
    description: 'Transforming teams and businesses through world-class training and coaching.',
  },
  robots: { index: true, follow: true },
  icons: {
    icon: '/images/WhatsApp_Image_2026-07-05_at_7.53.03_AM_(1).jpeg',
    apple: '/images/WhatsApp_Image_2026-07-05_at_7.53.03_AM_(1).jpeg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ background: '#0a0f1e' }}>{children}</body>
    </html>
  );
}
