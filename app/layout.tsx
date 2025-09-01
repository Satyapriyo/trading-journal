import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://tradejournaling.vercel.app'),
  title: {
    default: "Trade Journaling - Free Professional Trading Journal & Analytics Platform",
    template: "%s | Trade Journaling - Best Free Trading Journal"
  },
  description: "Free professional trading journal with advanced analytics, performance tracking, CSV import/export, and comprehensive trade management. Track your trading journey to success with the best free trading journal platform.",
  keywords: [
    "trading journal",
    "free trading journal",
    "trade tracker",
    "trading analytics",
    "trading performance",
    "stock trading journal",
    "forex trading journal",
    "crypto trading journal",
    "day trading journal",
    "swing trading tracker",
    "trading diary",
    "trade log",
    "trading statistics",
    "trading metrics",
    "profit loss tracker",
    "trading calendar",
    "trade analysis",
    "trading psychology",
    "trading results",
    "portfolio tracker"
  ],
  authors: [{ name: "Trade Journaling Team" }],
  creator: "Trade Journaling",
  publisher: "Trade Journaling",
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://tradejournaling.vercel.app',
    title: 'Trade Journaling - Best Free Trading Journal & Analytics Platform',
    description: 'Professional trading journal with advanced analytics, performance tracking, and comprehensive trade management. Start tracking your trades for free today!',
    siteName: 'Trade Journaling',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Trade Journaling - Free Professional Trading Journal Platform',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trade Journaling - Best Free Trading Journal Platform',
    description: 'Professional trading journal with advanced analytics and performance tracking. Free forever!',
    images: ['/twitter-image.jpg'],
    creator: '@tradejournaling',
  },
  alternates: {
    canonical: 'https://tradejournaling.vercel.app',
  },
  category: 'Finance',
  classification: 'Trading Tools',
  other: {
    'google-site-verification': 'your-google-verification-code-here',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Trade Journaling',
    description: 'Free professional trading journal with advanced analytics, performance tracking, and comprehensive trade management tools.',
    url: 'https://tradejournaling.vercel.app',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free forever trading journal platform'
    },
    featureList: [
      'Advanced Trading Analytics',
      'Performance Tracking',
      'CSV Import/Export',
      'Trading Calendar',
      'Profit & Loss Analysis',
      'Symbol Performance Analysis',
      'Trade Management',
      'Journal Entries'
    ],
    screenshot: 'https://tradejournaling.vercel.app/screenshot.jpg',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      bestRating: '5',
      worstRating: '1',
      ratingCount: '1247'
    }
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="canonical" href="https://tradejournaling.vercel.app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Trade Journaling" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          defaultTheme="light"
          storageKey="trading-journal-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
