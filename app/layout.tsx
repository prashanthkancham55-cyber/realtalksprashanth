import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

const BASE_URL = 'https://www.realtalksprashanth.in';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'RealTalks Prashanth | Corporate Trainer, Sales Trainer & Leadership Coach in India',
    template: '%s | RealTalks Prashanth',
  },
  description:
    'Prashanth is India\'s leading corporate trainer, sales coach and leadership expert with 9+ years of experience and 20,000+ professionals trained. Book a free discovery call to transform your team.',
  keywords: [
    'corporate trainer India',
    'sales trainer Hyderabad',
    'leadership coach India',
    'motivational speaker corporate',
    'RealTalks Prashanth',
    'business growth training',
    'sales training India',
    'team performance training',
    'real estate sales training',
    'leadership development program',
  ],
  authors: [{ name: 'Prashanth', url: BASE_URL }],
  creator: 'Prashanth — RealTalks',
  publisher: 'RealTalks Prashanth',
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: 'RealTalks Prashanth | Transform Your Team. Transform Your Business.',
    description:
      'Corporate Trainer • Sales Trainer • Leadership Coach • Motivational Speaker. 9+ years, 20,000+ professionals trained across India.',
    url: BASE_URL,
    siteName: 'RealTalks Prashanth',
    type: 'website',
    locale: 'en_IN',
    images: [
      {
        url: `${BASE_URL}/images/ChatGPT_Image_Jul_6,_2026,_07_29_03_PM.png`,
        width: 1200,
        height: 630,
        alt: 'RealTalks Prashanth — Corporate Trainer & Keynote Speaker',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RealTalks Prashanth | Corporate Trainer & Leadership Coach',
    description:
      'Transforming teams and businesses through world-class training and coaching. 9+ years, 20,000+ trained.',
    images: [`${BASE_URL}/images/ChatGPT_Image_Jul_6,_2026,_07_29_03_PM.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/images/Untitled_design_(7) copy.png', type: 'image/png' },
    ],
    apple: '/images/Untitled_design_(7) copy.png',
  },
  verification: {
    google: 'google-site-verification',
  },
};

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Prashanth',
  jobTitle: 'Corporate Trainer, Sales Coach & Leadership Expert',
  description:
    'India-based corporate trainer, sales trainer, leadership coach and motivational speaker with 9+ years of experience training 20,000+ professionals.',
  url: BASE_URL,
  image: `${BASE_URL}/images/WhatsApp_Image_2026-07-05_at_7.53.03_AM_(3).jpeg`,
  sameAs: [
    'https://www.instagram.com/realtalksprashanth',
    'https://www.facebook.com/share/1CegWPdwhT/',
    'https://youtube.com/@realtalks_prashanth',
    'https://www.linkedin.com/in/prashanth-k-0772423b8',
  ],
  knowsAbout: [
    'Corporate Training',
    'Sales Training',
    'Leadership Coaching',
    'Motivational Speaking',
    'Team Building',
    'Business Growth',
  ],
  offers: {
    '@type': 'Offer',
    name: 'Free Discovery Call',
    description: 'Book a free 30-minute discovery call to discuss your training needs.',
    price: '0',
    priceCurrency: 'INR',
  },
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'RealTalks Prashanth',
  description:
    'Premium corporate training, sales training and leadership coaching services across India.',
  url: BASE_URL,
  logo: `${BASE_URL}/images/ChatGPT_Image_Jul_6,_2026,_07_29_03_PM.png`,
  image: `${BASE_URL}/images/ChatGPT_Image_Jul_6,_2026,_07_29_03_PM.png`,
  telephone: '+918143062777',
  email: 'speaker@realtalksprashanth.in',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'IN',
  },
  priceRange: '₹₹₹',
  serviceArea: {
    '@type': 'Country',
    name: 'India',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Training Programs',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Corporate Training' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Sales Training' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Leadership Coaching' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Motivational Speaking' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Freshers Training' } },
    ],
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5',
    bestRating: '5',
    ratingCount: '200',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900&family=Cormorant+Garamond:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="canonical" href={BASE_URL} />
      </head>
      <body style={{ background: '#061326' }}>
        {children}
        <Script
          id="schema-person"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
          strategy="afterInteractive"
        />
        <Script
          id="schema-business"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
          strategy="afterInteractive"
        />
      <Script
  async
  src="https://www.googletagmanager.com/gtag/js?id=G-4RYBH44VH0"
/>

<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-4RYBH44VH0');
  `}
</Script></body>
    </html>
  );
}
