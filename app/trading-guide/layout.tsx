import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trading Journal Guide - How to Track Your Trades Effectively | Trade Journaling",
  description: "Complete guide on how to use a trading journal effectively. Learn best practices for tracking trades, analyzing performance, and improving your trading results with professional techniques.",
  keywords: "trading journal guide, how to track trades, trading diary, trade analysis, trading performance improvement, trading journal best practices, trade tracking guide",
  openGraph: {
    title: "The Ultimate Trading Journal Guide - Professional Trade Tracking",
    description: "Master the art of trade tracking and analysis. Learn professional techniques used by successful traders worldwide to improve trading performance.",
    url: "https://tradejournaling.vercel.app/trading-guide",
  },
  twitter: {
    title: "The Ultimate Trading Journal Guide - Trade Tracking Made Easy",
    description: "Complete guide on effective trade journaling. Learn best practices for tracking and analyzing your trading performance.",
  },
  alternates: {
    canonical: "https://tradejournaling.vercel.app/trading-guide",
  },
};

export default function TradingGuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
