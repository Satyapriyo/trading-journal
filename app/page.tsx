"use client";

import { useState } from 'react';
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
import { TrendingUp, BarChart3, BookOpen, DollarSign } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function TradingJournalApp() {
  const { trades, loading: tradesLoading, addTrade, updateTrade, deleteTrade } = useTrades();
  const { entries, loading: journalLoading, addEntry, updateEntry, deleteEntry } = useJournal();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isTradeDialogOpen, setIsTradeDialogOpen] = useState(false);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  
  const metrics = calculateMetrics(trades);
  const openTrades = trades.filter(trade => trade.isOpen);
  const closedTrades = trades.filter(trade => !trade.isOpen);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (tradesLoading || journalLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your trading journal...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">Total P&L</p>
                      <p className="text-2xl font-bold">{formatCurrency(metrics.totalPnL)}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Win Rate</p>
                      <p className="text-2xl font-bold">{metrics.winRate.toFixed(1)}%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">Total Trades</p>
                      <p className="text-2xl font-bold">{metrics.totalTrades}</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm font-medium">Open Positions</p>
                      <p className="text-2xl font-bold">{openTrades.length}</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-orange-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
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
                          <div key={trade.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
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
                          <div key={entry.id} className="p-3 bg-slate-50 rounded-lg">
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
          </div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddTrade={() => setIsTradeDialogOpen(true)}
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        <div className="container mx-auto px-4 py-8">
          {renderContent()}
        </div>
      </div>

      {/* Add Trade Dialog */}
      <Dialog open={isTradeDialogOpen} onOpenChange={setIsTradeDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Trade</DialogTitle>
            <DialogDescription>
              Enter your trade details to start tracking your performance
            </DialogDescription>
          </DialogHeader>
          <TradeForm 
            onSubmit={(trade) => {
              addTrade(trade);
              setIsTradeDialogOpen(false);
            }} 
          />
        </DialogContent>
      </Dialog>
      
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