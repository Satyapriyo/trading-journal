"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { motion } from 'framer-motion';
import { PieChart, Pie } from 'recharts';
import {
    TrendingUp,
    BarChart3,
    Calendar,
    FileText,
    Upload,
    Target,
    DollarSign,
    ArrowRight,
    BookOpen,
    Activity
} from 'lucide-react';

import Topbar from './topbar';
interface LandingPageProps {
    onNavigateToDashboard: () => void;
}

export default function LandingPage({ onNavigateToDashboard }: LandingPageProps) {
    const handleDocsClick = () => {
        // For now, we'll just scroll to features or show an alert
        // In the future, you can navigate to a proper docs page
        alert('Documentation coming soon!');
    };

    return (
        <div>
            <motion.div
                className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-black"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                {/* Hero Section */}
                <div className="relative overflow-hidden">
                    <Topbar />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                        <motion.div
                            className="text-center"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                <Badge variant="secondary" className="mb-4 px-3 py-1">
                                    <TrendingUp className="h-4 w-4 mr-1" />
                                    Professional Trading Journal
                                </Badge>
                            </motion.div>

                            <motion.h1
                                className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                            >
                                <motion.span
                                    className="block"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.8 }}
                                >
                                    Best Free Trading Journal
                                </motion.span>
                                <motion.span
                                    className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 1 }}
                                >
                                    Professional Trade Tracker
                                </motion.span>
                            </motion.h1>

                            <motion.p
                                className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 1.2 }}
                            >
                                The ultimate free trading journal and analytics platform. Track trades, analyze performance,
                                and improve your trading strategy with advanced charts, P&L tracking, and comprehensive trade management tools.
                            </motion.p>

                            <motion.div
                                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 1.4 }}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button
                                        size="lg"
                                        className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-600 dark:to-black hover:from-blue-700 hover:to-blue-900 dark:hover:from-blue-700 dark:hover:to-gray-900 text-white px-8 py-3 text-lg"
                                        onClick={onNavigateToDashboard}
                                    >
                                        <BarChart3 className="mr-2 h-5 w-5" />
                                        Go to Dashboard
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="px-8 py-3 text-lg border-blue-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-gray-800"
                                        onClick={handleDocsClick}
                                    >
                                        <BookOpen className="mr-2 h-5 w-5" />
                                        View Documentation
                                    </Button>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Animated Decorative Background Elements */}
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                        <motion.div
                            className="absolute top-20 left-10 w-20 h-20 bg-blue-200 dark:bg-blue-900 rounded-full opacity-20"
                            animate={{
                                y: [0, -10, 0],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                        <motion.div
                            className="absolute top-40 right-20 w-32 h-32 bg-blue-300 dark:bg-blue-800 rounded-full opacity-20"
                            animate={{
                                y: [0, 15, 0],
                                x: [0, -5, 0],
                                scale: [1, 0.9, 1]
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 1
                            }}
                        />
                        <motion.div
                            className="absolute bottom-20 left-20 w-24 h-24 bg-blue-400 dark:bg-blue-700 rounded-full opacity-20"
                            animate={{
                                y: [0, -20, 0],
                                x: [0, 10, 0],
                                scale: [1, 1.2, 1]
                            }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 2
                            }}
                        />
                    </div>
                </div>

                {/* Features Section */}
                <motion.div
                    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Complete Free Trading Journal Features
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Professional trading tools and analytics to track your trades, analyze performance, and become a profitable trader.
                            100% free forever with no hidden fees or limitations.
                        </p>
                    </motion.div>

                    {/* Bento Grid Layout - Matching Reference */}
                    <div className="relative max-w-7xl mx-auto">
                        <div className="grid grid-cols-12 gap-4 min-h-[500px]">
                            {/* Top Left - Advanced Analytics */}
                            <motion.div
                                className="col-span-4 row-span-2"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                whileHover={{ y: -5 }}
                            >
                                <Card className="h-[240px] bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-800 dark:to-slate-900 text-white border-slate-600 hover:shadow-xl transition-all duration-300">
                                    <CardContent className="p-6 h-full flex flex-col">
                                        <motion.div
                                            className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4"
                                            whileHover={{ scale: 1.1 }}
                                        >
                                            <TrendingUp className="h-6 w-6 text-white" />
                                        </motion.div>
                                        <h3 className="text-xl font-bold mb-3">Advanced Analytics</h3>
                                        <p className="text-gray-300 text-sm leading-relaxed mb-6 flex-1">
                                            Comprehensive performance tracking with equity curves, P&L analysis, and detailed insights.
                                        </p>
                                        <div className="text-xs text-gray-400">14 days trial</div>
                                        <div className="text-xs text-gray-400">after - $5/month</div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Top Center - AI Trading Companion */}
                            <motion.div
                                className="col-span-4 row-span-2"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                whileHover={{ y: -5 }}
                            >
                                <Card className="h-[240px] bg-gradient-to-br from-purple-600 to-blue-600 text-white hover:shadow-xl transition-all duration-300">
                                    <CardContent className="p-6 h-full flex flex-col text-center justify-center">
                                        <div className="text-yellow-300 text-sm mb-2">✨ TradeJournal</div>
                                        <h2 className="text-2xl font-bold mb-4">Your AI Trading Companion</h2>
                                        <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                                            Advanced analytics and insights powered by AI to optimize your trading performance
                                        </p>
                                        <motion.button
                                            className="bg-gray-800 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-700 transition-all"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            🔥 Generate
                                        </motion.button>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Top Right - 25M Stats */}
                            <motion.div
                                className="col-span-4 row-span-1"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                whileHover={{ y: -5 }}
                            >
                                <Card className="h-[115px] bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-800 dark:to-slate-900 text-white border-slate-600 hover:shadow-lg transition-all duration-300">
                                    <CardContent className="p-6 h-full flex flex-col justify-center items-center text-center">
                                        <motion.div
                                            className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center mb-2"
                                            whileHover={{ scale: 1.1, rotate: 10 }}
                                        >
                                            <Activity className="h-5 w-5" />
                                        </motion.div>
                                        <div className="text-3xl font-bold mb-1">25M</div>
                                        <div className="text-gray-300 text-xs">created trades</div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Middle Left - User Stats */}
                            <motion.div
                                className="col-span-2 row-span-2"
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                whileHover={{ y: -5 }}
                            >
                                <Card className="h-[240px] bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-800 dark:to-slate-900 text-white border-slate-600 hover:shadow-lg transition-all duration-300">
                                    <CardContent className="p-6 h-full flex flex-col">
                                        <div className="text-4xl font-bold text-orange-400 mb-2">12K</div>
                                        <div className="text-gray-300 text-sm mb-4">happy traders</div>
                                        <div className="flex -space-x-1 mb-6">
                                            <div className="w-6 h-6 rounded-full bg-orange-500 border-2 border-slate-800"></div>
                                            <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-slate-800"></div>
                                            <div className="w-6 h-6 rounded-full bg-purple-500 border-2 border-slate-800"></div>
                                        </div>
                                        <motion.button
                                            className="bg-purple-600 hover:bg-purple-700 rounded-lg py-2 px-4 text-sm font-medium mt-auto transition-all"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            🔥 Generate
                                        </motion.button>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Center - Pie Chart */}
                            <motion.div
                                className="col-span-6 row-span-2 relative flex items-center justify-center"
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                            >
                                <div className="relative w-full h-[240px] flex items-center justify-center">
                                    {/* Outer Glow Ring */}
                                    <motion.div
                                        className="absolute w-60 h-60 rounded-full bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-orange-500/20"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    />

                                    {/* Chart Container */}
                                    <div className="relative w-48 h-48 bg-slate-900 dark:bg-gray-900 rounded-full flex items-center justify-center">
                                        <ChartContainer
                                            config={{
                                                stocks: { label: "Stocks", color: "#3B82F6" },
                                                options: { label: "Options", color: "#8B5CF6" },
                                                forex: { label: "Forex", color: "#F59E0B" },
                                                crypto: { label: "Crypto", color: "#10B981" }
                                            }}
                                            className="w-40 h-40"
                                        >
                                            <PieChart>
                                                <Pie
                                                    data={[
                                                        { name: 'stocks', value: 40, fill: '#3B82F6' },
                                                        { name: 'options', value: 25, fill: '#8B5CF6' },
                                                        { name: 'forex', value: 20, fill: '#F59E0B' },
                                                        { name: 'crypto', value: 15, fill: '#10B981' }
                                                    ]}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={35}
                                                    outerRadius={70}
                                                    paddingAngle={3}
                                                    dataKey="value"
                                                />
                                                <ChartTooltip content={<ChartTooltipContent />} />
                                            </PieChart>
                                        </ChartContainer>

                                        {/* Center Text */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center">
                                                <div className="text-white text-base font-bold">Trading</div>
                                                <div className="text-gray-400 text-sm">Portfolio</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Floating Labels */}
                                    <motion.div
                                        className="absolute -top-2 left-12 bg-blue-500 text-white text-xs px-2 py-1 rounded-full"
                                        animate={{ y: [-1, 1, -1] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                    >
                                        Stocks 40%
                                    </motion.div>
                                    <motion.div
                                        className="absolute top-6 -right-6 bg-purple-500 text-white text-xs px-2 py-1 rounded-full"
                                        animate={{ y: [1, -1, 1] }}
                                        transition={{ duration: 3, repeat: Infinity, delay: 0.7 }}
                                    >
                                        Options 25%
                                    </motion.div>
                                    <motion.div
                                        className="absolute -bottom-2 right-12 bg-orange-500 text-white text-xs px-2 py-1 rounded-full"
                                        animate={{ y: [-1, 1, -1] }}
                                        transition={{ duration: 3, repeat: Infinity, delay: 1.4 }}
                                    >
                                        Forex 20%
                                    </motion.div>
                                    <motion.div
                                        className="absolute bottom-6 -left-6 bg-green-500 text-white text-xs px-2 py-1 rounded-full"
                                        animate={{ y: [1, -1, 1] }}
                                        transition={{ duration: 3, repeat: Infinity, delay: 2.1 }}
                                    >
                                        Crypto 15%
                                    </motion.div>
                                </div>
                            </motion.div>

                            {/* Right Top - Journal Notes */}
                            <motion.div
                                className="col-span-2 row-span-1"
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                whileHover={{ y: -2 }}
                            >
                                <Card className="h-[115px] bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-800 dark:to-slate-900 text-white border-slate-600 hover:shadow-lg transition-all duration-300">
                                    <CardContent className="p-4 h-full flex items-center">
                                        <motion.div
                                            className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-4"
                                            whileHover={{ scale: 1.1 }}
                                        >
                                            <FileText className="h-5 w-5 text-white" />
                                        </motion.div>
                                        <div>
                                            <h3 className="font-semibold text-sm mb-1">Journal Notes</h3>
                                            <p className="text-gray-300 text-xs">Track psychology</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Bottom Left - Trading Templates */}
                            <motion.div
                                className="col-span-4 row-span-1"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.7 }}
                                whileHover={{ y: -2 }}
                            >
                                <Card className="h-[115px] bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-800 dark:to-slate-900 text-white border-slate-600 hover:shadow-lg transition-all duration-300">
                                    <CardContent className="p-4 h-full flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold mb-1">Trading Templates</h3>
                                            <p className="text-gray-300 text-xs">Use pre-made templates to jumpstart creativity.</p>
                                        </div>
                                        <div className="flex flex-col items-center space-y-1">
                                            <div className="text-xs bg-orange-500 px-2 py-1 rounded-full">14 days trial</div>
                                            <div className="flex space-x-1">
                                                <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                                                <div className="w-1 h-1 bg-orange-400 rounded-full"></div>
                                                <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Bottom Center - Calendar */}
                            <motion.div
                                className="col-span-2 row-span-1"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.8 }}
                                whileHover={{ y: -2 }}
                            >
                                <Card className="h-[115px] bg-gradient-to-br from-orange-600 to-orange-700 text-white border-orange-500 hover:shadow-lg transition-all duration-300">
                                    <CardContent className="p-4 h-full flex items-center">
                                        <motion.div
                                            className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mr-4"
                                            whileHover={{ scale: 1.1 }}
                                        >
                                            <Calendar className="h-5 w-5 text-white" />
                                        </motion.div>
                                        <div>
                                            <h3 className="font-semibold text-sm mb-1">Calendar</h3>
                                            <p className="text-orange-100 text-xs">Daily tracking</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Bottom Center Right - CSV Import */}
                            <motion.div
                                className="col-span-3 row-span-1"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.9 }}
                                whileHover={{ y: -2 }}
                            >
                                <Card className="h-[115px] bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-800 dark:to-slate-900 text-white border-slate-600 hover:shadow-lg transition-all duration-300">
                                    <CardContent className="p-4 h-full flex items-center">
                                        <motion.div
                                            className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mr-4"
                                            whileHover={{ scale: 1.1 }}
                                        >
                                            <Upload className="h-5 w-5 text-white" />
                                        </motion.div>
                                        <div>
                                            <h3 className="font-semibold text-sm mb-1">CSV Import</h3>
                                            <p className="text-gray-300 text-xs">Import from all major brokers seamlessly.</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Bottom Right - Analytics */}
                            <motion.div
                                className="col-span-3 row-span-1"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 1.0 }}
                                whileHover={{ y: -2 }}
                            >
                                <Card className="h-[115px] bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-800 dark:to-slate-900 text-white border-slate-600 hover:shadow-lg transition-all duration-300">
                                    <CardContent className="p-4 h-full flex items-center">
                                        <motion.div
                                            className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-4"
                                            whileHover={{ scale: 1.1 }}
                                        >
                                            <Target className="h-5 w-5 text-white" />
                                        </motion.div>
                                        <div>
                                            <h3 className="font-semibold text-sm mb-1">Analytics</h3>
                                            <p className="text-gray-300 text-xs">Performance</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Call to Action Section */}
                <motion.div
                    className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-700 dark:to-black py-16"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.div
                        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <motion.h2
                            className="text-3xl md:text-4xl font-bold text-white mb-4"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            Start Your Free Trading Journal Today
                        </motion.h2>
                        <motion.p
                            className="text-xl text-blue-100 mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            Join over 10,000+ traders using Trade Journaling to track their performance and become profitable.
                            100% free forever - no credit card required, no hidden fees, unlimited trades.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.8 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                size="lg"
                                variant="secondary"
                                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
                                onClick={onNavigateToDashboard}
                            >
                                <DollarSign className="mr-2 h-5 w-5" />
                                Start Free Trading Journal
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Enhanced SEO Content Section */}
                <motion.div
                    className="bg-gradient-to-br from-white via-blue-50 to-slate-50 dark:from-gray-900 dark:via-gray-800 dark:to-black py-20"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Section Header */}
                        <motion.div
                            className="text-center mb-16"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <motion.div
                                className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-800 dark:text-blue-300 text-sm font-medium mb-6"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                            >
                                <TrendingUp className="w-4 h-4 mr-2" />
                                Essential Trading Knowledge
                            </motion.div>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                                Why Trade Journaling is{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600">
                                    Essential
                                </span>{' '}
                                for Successful Trading
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                                Professional traders understand that keeping a detailed trading journal is crucial for long-term success.
                                Trade Journaling provides the most comprehensive free platform designed for all types of traders.
                            </p>
                        </motion.div>

                        <div className="grid lg:grid-cols-2 gap-12 items-start">
                            {/* Left Column - Key Benefits */}
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                <div className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
                                    <div className="flex items-center mb-6">
                                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                                            <BarChart3 className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Key Benefits</h3>
                                    </div>

                                    <div className="space-y-6">
                                        {[
                                            {
                                                icon: "📈",
                                                title: "Track Trading Performance",
                                                description: "Monitor your P&L, win rate, and average gains/losses with detailed analytics"
                                            },
                                            {
                                                icon: "🎯",
                                                title: "Identify Trading Patterns",
                                                description: "Discover which strategies work best for your unique trading style"
                                            },
                                            {
                                                icon: "🛡️",
                                                title: "Improve Risk Management",
                                                description: "Analyze your position sizing and risk-reward ratios for better decisions"
                                            },
                                            {
                                                icon: "📊",
                                                title: "Tax Reporting Made Easy",
                                                description: "Export detailed trade records for seamless tax preparation"
                                            },
                                            {
                                                icon: "🧠",
                                                title: "Psychology Tracking",
                                                description: "Document emotions and mindset to improve trading discipline"
                                            }
                                        ].map((benefit, index) => (
                                            <motion.div
                                                key={index}
                                                className="flex items-start space-x-4"
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.1 * index, duration: 0.5 }}
                                                whileHover={{ x: 5 }}
                                            >
                                                <div className="text-2xl">{benefit.icon}</div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                                        {benefit.title}
                                                    </h4>
                                                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                                                        {benefit.description}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Right Column - Trading Styles & Comparison */}
                            <motion.div
                                className="space-y-8"
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                            >
                                {/* Trading Styles Card */}
                                <div className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
                                    <div className="flex items-center mb-6">
                                        <div className="w-12 h-12 bg-gradient-to-r from-slate-600 to-slate-700 dark:from-gray-600 dark:to-gray-800 rounded-xl flex items-center justify-center mr-4">
                                            <Target className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Perfect for All Trading Styles</h3>
                                    </div>

                                    <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                                        Whether you&apos;re a day trader executing dozens of trades daily, a swing trader holding positions for weeks,
                                        or a long-term investor, Trade Journaling adapts to your style.
                                    </p>

                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { name: "Stocks", icon: "📈" },
                                            { name: "Options", icon: "🎯" },
                                            { name: "Forex", icon: "💱" },
                                            { name: "Crypto", icon: "₿" },
                                            { name: "Futures", icon: "⚡" },
                                            { name: "ETFs", icon: "📊" }
                                        ].map((asset, index) => (
                                            <motion.div
                                                key={index}
                                                className="flex items-center space-x-2 p-3 bg-blue-50 dark:bg-gray-700 rounded-lg"
                                                whileHover={{ scale: 1.05 }}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                whileInView={{ opacity: 1, scale: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.1 * index }}
                                            >
                                                <span className="text-lg">{asset.icon}</span>
                                                <span className="font-medium text-gray-900 dark:text-white text-sm">
                                                    {asset.name}
                                                </span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Comparison Card */}
                                <div className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-700 dark:to-black rounded-2xl p-8 text-white shadow-xl">
                                    <div className="flex items-center mb-6">
                                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                                            <DollarSign className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold">Free vs Paid Platforms</h3>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
                                            <span className="font-medium">Monthly Cost</span>
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-green-300">$0 Forever</div>
                                                <div className="text-sm text-blue-200 line-through">$30-100/month</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
                                            <span className="font-medium">Feature Limitations</span>
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-green-300">None</div>
                                                <div className="text-sm text-blue-200">Many restrictions</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
                                            <span className="font-medium">Credit Card Required</span>
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-green-300">No</div>
                                                <div className="text-sm text-blue-200">Yes</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* FAQ Section */}
                <div className="bg-gray-50 dark:bg-gray-800 py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                Frequently Asked Questions
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300">
                                Everything you need to know about Trade Journaling
                            </p>
                        </div>

                        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm">
                            <Accordion type="single" collapsible className="w-full px-6">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger className="text-left">
                                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Is Trade Journaling really free?
                                        </span>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-gray-600 dark:text-gray-300 pb-4">
                                            Yes! Trade Journaling is completely free forever. No trial periods, no hidden fees,
                                            no credit card required. You get unlimited trades, full analytics, and all features at no cost.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="item-2">
                                    <AccordionTrigger className="text-left">
                                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                            What types of trading can I track?
                                        </span>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-gray-600 dark:text-gray-300 pb-4">
                                            Trade Journaling supports all trading styles and instruments: stocks, options, forex,
                                            cryptocurrency, futures, day trading, swing trading, and long-term investing.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="item-3">
                                    <AccordionTrigger className="text-left">
                                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Can I import trades from my broker?
                                        </span>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-gray-600 dark:text-gray-300 pb-4">
                                            Yes! You can easily import trades from popular brokers like TD Ameritrade, E*TRADE,
                                            Interactive Brokers, and others using CSV files. We also support manual trade entry.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="item-4">
                                    <AccordionTrigger className="text-left">
                                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Is my trading data secure?
                                        </span>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-gray-600 dark:text-gray-300 pb-4">
                                            Absolutely. Your data is stored securely and never shared with third parties.
                                            We use industry-standard encryption and security practices to protect your information.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="item-5">
                                    <AccordionTrigger className="text-left">
                                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                            How does Trade Journaling compare to paid alternatives?
                                        </span>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-gray-600 dark:text-gray-300 pb-4">
                                            Trade Journaling offers the same professional features as paid platforms costing $30-100+ per month,
                                            but completely free. You get advanced analytics, P&L tracking, CSV import/export, and more.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="item-6">
                                    <AccordionTrigger className="text-left">
                                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Can I use Trade Journaling for tax reporting?
                                        </span>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-gray-600 dark:text-gray-300 pb-4">
                                            Yes! Export detailed trade reports perfect for tax preparation. Track all necessary information
                                            including dates, symbols, quantities, prices, and P&L for accurate tax filing.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-900 py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-4 gap-8 mb-8">
                            <div>
                                <h4 className="text-white font-semibold mb-4">Trade Journaling</h4>
                                <p className="text-gray-400 text-sm">
                                    The best free trading journal and analytics platform for professional traders.
                                </p>
                            </div>
                            <div>
                                <h4 className="text-white font-semibold mb-4">Features</h4>
                                <ul className="space-y-2 text-gray-400 text-sm">
                                    <li>Trading Analytics</li>
                                    <li>P&L Tracking</li>
                                    <li>CSV Import/Export</li>
                                    <li>Trading Calendar</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-white font-semibold mb-4">Trading Types</h4>
                                <ul className="space-y-2 text-gray-400 text-sm">
                                    <li>Day Trading Journal</li>
                                    <li>Swing Trading Tracker</li>
                                    <li>Forex Trading Log</li>
                                    <li>Crypto Trading Journal</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-white font-semibold mb-4">Resources</h4>
                                <ul className="space-y-2 text-gray-400 text-sm">
                                    <li>Trading Tips</li>
                                    <li>Risk Management</li>
                                    <li>Performance Analysis</li>
                                    <li>Tax Reporting</li>
                                </ul>
                            </div>
                        </div>
                        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
                            <p>&copy; 2025 Trade Journaling. The best free trading journal platform for professional traders worldwide.</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
