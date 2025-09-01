"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect } from "react";
import Lenis from "lenis";

export default function TradingGuidePage() {
  useEffect(() => {
    // Initialize Lenis only on client side
    const lenis = new Lenis({
      autoRaf: true,
    });

    // Listen for the scroll event and log the event data
    lenis.on('scroll', (e) => {
      console.log(e);
    });

    // Cleanup function to destroy lenis instance
    return () => {
      lenis.destroy();
    };
  }, []);
  return (
    <motion.div
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto px-4 py-16">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <motion.h1
            className="text-4xl font-bold tracking-tight mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            The Ultimate Trading Journal Guide
          </motion.h1>
          <motion.p
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Master the art of trade tracking and analysis to become a consistently profitable trader.
            Learn professional techniques used by successful traders worldwide.
          </motion.p>
        </motion.div>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ y: -5 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.3 }}
                  >
                    📈
                  </motion.span>
                  Why Every Successful Trader Keeps a Trading Journal
                </CardTitle>
                <CardDescription>
                  Professional traders understand that consistent profitability comes from analyzing patterns, not just making trades.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <motion.div
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                    >
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Badge variant="secondary">Strategy</Badge>
                      </motion.div>
                      <div>
                        <h4 className="font-semibold">Identify Profitable Strategies</h4>
                        <p className="text-sm text-muted-foreground">See which setups work best for you</p>
                      </div>
                    </motion.div>
                    <motion.div
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                    >
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Badge variant="destructive">Patterns</Badge>
                      </motion.div>
                      <div>
                        <h4 className="font-semibold">Spot Losing Patterns</h4>
                        <p className="text-sm text-muted-foreground">Recognize and eliminate costly mistakes</p>
                      </div>
                    </motion.div>
                  </div>
                  <div className="space-y-3">
                    <motion.div
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.9 }}
                    >
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Badge variant="outline">Psychology</Badge>
                      </motion.div>
                      <div>
                        <h4 className="font-semibold">Track Emotional States</h4>
                        <p className="text-sm text-muted-foreground">Understand how psychology affects trading</p>
                      </div>
                    </motion.div>
                    <motion.div
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 1.0 }}
                    >
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Badge variant="default">Risk</Badge>
                      </motion.div>
                      <div>
                        <h4 className="font-semibold">Manage Risk Effectively</h4>
                        <p className="text-sm text-muted-foreground">Monitor position sizing and risk-reward ratios</p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <motion.span
                      initial={{ rotate: -180 }}
                      animate={{ rotate: 0 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                    >
                      📊
                    </motion.span>
                    Basic Trade Information
                  </CardTitle>
                  <CardDescription>Essential data points to track for every trade</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {[
                      "Date and time of entry and exit",
                      "Symbol/instrument traded",
                      "Position size and direction (long/short)",
                      "Entry and exit prices",
                      "Stop loss and take profit levels",
                      "Profit and loss (P&L)"
                    ].map((item, index) => (
                      <motion.li
                        key={index}
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                        whileHover={{ x: 5 }}
                      >
                        <motion.div
                          className="w-2 h-2 bg-primary rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.9 + index * 0.1, duration: 0.2 }}
                        />
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.2, 1] }}
                      transition={{ delay: 0.8, duration: 0.6 }}
                    >
                      📈
                    </motion.span>
                    Advanced Metrics
                  </CardTitle>
                  <CardDescription>Professional-grade analytics for serious traders</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {[
                      "Win rate percentage",
                      "Average win vs average loss",
                      "Risk-reward ratio",
                      "Maximum drawdown",
                      "Profit factor",
                      "Sharpe ratio"
                    ].map((item, index) => (
                      <motion.li
                        key={index}
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 1.0 + index * 0.1 }}
                        whileHover={{ x: 5 }}
                      >
                        <motion.div
                          className="w-2 h-2 bg-green-500 rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 1.1 + index * 0.1, duration: 0.2 }}
                        />
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            whileHover={{ y: -5 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <motion.span
                    initial={{ rotateY: 0 }}
                    animate={{ rotateY: 360 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                  >
                    📱
                  </motion.span>
                  Different Trading Styles, Different Approaches
                </CardTitle>
                <CardDescription>Customize your journal based on your trading strategy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      badge: { text: "Day Trading", variant: "default" as const },
                      title: "Multiple trades daily",
                      items: [
                        "• Time of day patterns",
                        "• Market session performance",
                        "• Scalping vs swing strategies",
                        "• Over-trading tendencies"
                      ]
                    },
                    {
                      badge: { text: "Swing Trading", variant: "secondary" as const },
                      title: "Positions held days to weeks",
                      items: [
                        "• Market conditions during entry",
                        "• Technical patterns that work",
                        "• Sector performance correlations",
                        "• News impact on positions"
                      ]
                    },
                    {
                      badge: { text: "Forex Trading", variant: "outline" as const },
                      title: "Currency pair trading",
                      items: [
                        "• Currency pair correlations",
                        "• Economic news impact",
                        "• Session overlap performance",
                        "• Carry trade opportunities"
                      ]
                    }
                  ].map((style, index) => (
                    <motion.div
                      key={index}
                      className="space-y-3"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 1.3 + index * 0.2 }}
                    >
                      <div className="flex items-center gap-2">
                        <motion.div whileHover={{ scale: 1.05 }}>
                          <Badge variant={style.badge.variant}>{style.badge.text}</Badge>
                        </motion.div>
                      </div>
                      <h4 className="font-semibold">{style.title}</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {style.items.map((item, itemIndex) => (
                          <motion.li
                            key={itemIndex}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 1.5 + index * 0.2 + itemIndex * 0.1 }}
                          >
                            {item}
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            whileHover={{ y: -5 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: 360 }}
                    transition={{ delay: 1.8, duration: 0.8 }}
                  >
                    🚀
                  </motion.span>
                  How to Use Trade Journaling Platform
                </CardTitle>
                <CardDescription>Your complete guide to getting started with professional trade tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { title: "Import Your Trades", desc: "Upload CSV files from your broker automatically" },
                    { title: "Add Detailed Notes", desc: "Document your reasoning and emotions" },
                    { title: "Analyze Performance", desc: "Use advanced charts and metrics" },
                    { title: "Review Regularly", desc: "Weekly and monthly performance reviews" },
                    { title: "Export for Taxes", desc: "Generate reports for tax preparation" }
                  ].map((step, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 2.0 + index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <motion.div
                        className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold"
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{ delay: 2.1 + index * 0.1, duration: 0.5 }}
                      >
                        {index + 1}
                      </motion.div>
                      <div>
                        <h4 className="font-semibold">{step.title}</h4>
                        <p className="text-sm text-muted-foreground">{step.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            whileHover={{ y: -5 }}
          >
            <Card className="border-destructive/20 hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                  <motion.span
                    initial={{ rotate: 0 }}
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ delay: 2.5, duration: 0.6, repeat: 2 }}
                  >
                    ⚠️
                  </motion.span>
                  Common Trading Journal Mistakes to Avoid
                </CardTitle>
                <CardDescription>Learn from these common pitfalls to maximize your journal&apos;s effectiveness</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    [
                      { title: "Inconsistent Entries", desc: "Update your journal after every trade" },
                      { title: "Only Tracking Winners", desc: "Losing trades are equally important" }
                    ],
                    [
                      { title: "Ignoring Emotions", desc: "Psychology is crucial for improvement" },
                      { title: "No Regular Reviews", desc: "Schedule weekly analysis sessions" }
                    ]
                  ].map((column, columnIndex) => (
                    <div key={columnIndex} className="space-y-3">
                      {column.map((mistake, index) => (
                        <motion.div
                          key={index}
                          className="flex items-start gap-3"
                          initial={{ opacity: 0, x: columnIndex === 0 ? -20 : 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 2.7 + index * 0.2 }}
                        >
                          <motion.div
                            className="w-2 h-2 bg-destructive rounded-full mt-2"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 2.8 + index * 0.2, duration: 0.3 }}
                          />
                          <div>
                            <h4 className="font-semibold text-destructive">{mistake.title}</h4>
                            <p className="text-sm text-muted-foreground">{mistake.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 hover:shadow-xl transition-all duration-300">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl flex items-center justify-center gap-2">
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.3, 1] }}
                    transition={{ delay: 3.2, duration: 0.8 }}
                  >
                    🎯
                  </motion.span>
                  Start Your Free Trading Journal Today
                </CardTitle>
                <CardDescription className="text-lg">
                  Ready to improve your trading performance? Trade Journaling is completely free forever
                  with no limitations. Join thousands of traders who have improved their profitability.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-4">
                  <motion.div
                    className="flex justify-center gap-4 flex-wrap"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 3.4 }}
                  >
                    {[
                      "✅ 100% Free Forever",
                      "📊 Advanced Analytics",
                      "📈 Unlimited Trades",
                      "💾 CSV Import/Export"
                    ].map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 3.5 + index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <Badge variant="secondary" className="px-3 py-1">{feature}</Badge>
                      </motion.div>
                    ))}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 3.8 }}
                  >
                    <Button asChild size="lg" className="text-lg px-8 py-3">
                      <Link href="/">
                        <motion.span
                          whileHover={{ x: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          Start Free Trading Journal →
                        </motion.span>
                      </Link>
                    </Button>
                  </motion.div>
                  <motion.p
                    className="text-sm text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 4.0 }}
                  >
                    No credit card required • Set up in under 2 minutes
                  </motion.p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
