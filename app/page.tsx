"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTrades } from '@/hooks/use-trades';
import { useJournal } from '@/hooks/use-journal';
import { calculateMetrics } from '@/lib/calculations';
import TradeForm from '@/components/trade-form';
import TradeTable from '@/components/trade-table';
import PerformanceMetricsComponent from '@/components/performance-metrices';
import AnalyticsChart from '@/components/analytics-chart';
import JournalEntries from '@/components/journal-entries';
import ExportImport from '@/components/export-import';
import TradeEditDialog from '@/components/trade-edit-dialog';
import TradingCalendar from '@/components/trading-calendar';
import Sidebar from '@/components/sidebar';
import LandingPage from '@/components/landing-page';
import { TrendingUp, BarChart3, BookOpen, DollarSign } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Trade } from '@/types/trade';

export default function TradingJournalApp() {
  const { trades, loading: tradesLoading, addTrade, updateTrade, deleteTrade } = useTrades();
  const { entries, loading: journalLoading, addEntry, updateEntry, deleteEntry } = useJournal();
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isTradeDialogOpen, setIsTradeDialogOpen] = useState(false);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);

  const metrics = calculateMetrics(trades);
  const openTrades = trades.filter(trade => trade.isOpen);
  // const closedTrades = trades.filter(trade => !trade.isOpen); // Removed unused variable

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleNavigateToDashboard = () => {
    setShowLandingPage(false);
    setActiveTab('dashboard');
  };

  // Show landing page if user hasn't navigated to dashboard yet
  if (showLandingPage) {
    return <LandingPage onNavigateToDashboard={handleNavigateToDashboard} />;
  }

  if (tradesLoading || journalLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-black flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative">
            {/* Animated spinner */}
            <motion.div
              className="w-16 h-16 border-4 border-blue-200 dark:border-gray-700 rounded-full mx-auto mb-6"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 rounded-full mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />

            {/* Pulsing dots */}
            <div className="flex justify-center space-x-2 mb-6">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Loading Trading Journal
            </h3>
            <p className="text-slate-600 dark:text-gray-300">
              Preparing your trading workspace...
            </p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Quick Stats */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white dark:from-blue-600 dark:to-blue-800">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm font-medium">Total P&L</p>
                        <motion.p
                          className="text-xl sm:text-2xl font-bold"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          {formatCurrency(metrics.totalPnL)}
                        </motion.p>
                      </div>
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      >
                        <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-blue-200" />
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="bg-gradient-to-r from-slate-600 to-slate-700 text-white dark:from-gray-700 dark:to-gray-900">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-200 dark:text-gray-300 text-sm font-medium">Win Rate</p>
                        <motion.p
                          className="text-xl sm:text-2xl font-bold"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          {metrics.winRate.toFixed(1)}%
                        </motion.p>
                      </div>
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                      >
                        <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-slate-300 dark:text-gray-400" />
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="bg-gradient-to-r from-blue-400 to-blue-500 text-white dark:from-blue-800 dark:to-black">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm font-medium">Total Trades</p>
                        <motion.p
                          className="text-xl sm:text-2xl font-bold"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          {metrics.totalTrades}
                        </motion.p>
                      </div>
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                      >
                        <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-200" />
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="bg-gradient-to-r from-slate-500 to-slate-600 text-white dark:from-gray-800 dark:to-black">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-200 dark:text-gray-300 text-sm font-medium">Open Positions</p>
                        <motion.p
                          className="text-xl sm:text-2xl font-bold"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 }}
                        >
                          {openTrades.length}
                        </motion.p>
                      </div>
                      <motion.div
                        animate={{ rotateY: [0, 180, 0] }}
                        transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
                      >
                        <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-slate-300 dark:text-gray-400" />
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  <TradingCalendar trades={trades} />
                  <PerformanceMetricsComponent metrics={metrics} />
                </div>
              </div>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Open Positions</CardTitle>
                    <CardDescription>Currently active trades</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {openTrades.length === 0 ? (
                      <p className="text-center text-muted-foreground py-4">No open positions</p>
                    ) : (
                      <div className="space-y-3">
                        {openTrades.slice(0, 5).map(trade => (
                          <div key={trade.id} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-gray-800 rounded-lg">
                            <div>
                              <p className="font-medium">{trade.symbol}</p>
                              <p className="text-sm text-muted-foreground">
                                {trade.direction.toUpperCase()} • {formatCurrency(trade.entryPrice)}
                              </p>
                            </div>
                            <Badge variant={trade.direction === 'long' ? 'default' : 'secondary'}>
                              {trade.size}
                            </Badge>
                          </div>
                        ))}
                        {openTrades.length > 5 && (
                          <p className="text-center text-sm text-muted-foreground">
                            +{openTrades.length - 5} more positions
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Journal Entries</CardTitle>
                    <CardDescription>Latest reflections and notes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {entries.length === 0 ? (
                      <p className="text-center text-muted-foreground py-4">No journal entries yet</p>
                    ) : (
                      <div className="space-y-3">
                        {entries.slice(0, 3).map(entry => (
                          <div key={entry.id} className="p-3 bg-blue-50 dark:bg-gray-800 rounded-lg">
                            <h4 className="font-medium text-sm">{entry.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(entry.date).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        );

      case 'trades':
        return (
          <TradeTable
            trades={trades}
            onEdit={setEditingTrade}
            onDelete={deleteTrade}
          />
        );

      case 'analytics':
        return <AnalyticsChart trades={trades} />;

      case 'journal':
        return (
          <JournalEntries
            entries={entries}
            onAdd={addEntry}
            onUpdate={updateEntry}
            onDelete={deleteEntry}
          />
        );

      case 'performance':
        return <PerformanceMetricsComponent metrics={metrics} />;

      case 'settings':
        return <ExportImport trades={trades} journalEntries={entries} />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddTrade={() => setIsTradeDialogOpen(true)}
      />

      {/* Main Content */}
      <div className="flex-1 ml-0 lg:ml-64">
        <div className="container mx-auto px-4 py-8 lg:px-6">
          {renderContent()}
        </div>
      </div>

      {/* Add Trade Sheet */}
      <Sheet open={isTradeDialogOpen} onOpenChange={setIsTradeDialogOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Add New Trade</SheetTitle>
            <SheetDescription>
              Enter your trade details to start tracking your performance
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4">
            <TradeForm
              onSubmit={(trade) => {
                addTrade(trade);
                setIsTradeDialogOpen(false);
              }}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit Trade Dialog */}
      <TradeEditDialog
        trade={editingTrade}
        isOpen={!!editingTrade}
        onClose={() => setEditingTrade(null)}
        onUpdate={updateTrade}
      />
    </div>
  );
}