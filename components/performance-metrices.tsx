"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PerformanceMetrics } from '@/types/trade';
import { TrendingUp, TrendingDown, Target, DollarSign,  BarChart3 } from 'lucide-react';

interface PerformanceMetricsProps {
  metrics: PerformanceMetrics;
}

export default function PerformanceMetricsComponent({ metrics }: PerformanceMetricsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const MetricCard = ({ 
    title, 
    value, 
    icon: Icon, 
    description 
  }: { 
    title: string;
    value: string;
    icon: React.ComponentType<{ className?: string }>;
    trend?: 'positive' | 'negative' | 'neutral';
    description?: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );

  if (metrics.totalTrades === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>Your trading performance will appear here once you add some trades.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total P&L"
            value={formatCurrency(metrics.totalPnL)}
            icon={DollarSign}
            trend={metrics.totalPnL > 0 ? 'positive' : 'negative'}
            description={`From ${metrics.totalTrades} trades`}
          />
          
          <MetricCard
            title="Win Rate"
            value={formatPercent(metrics.winRate)}
            icon={Target}
            trend={metrics.winRate > 50 ? 'positive' : 'negative'}
            description="Percentage of winning trades"
          />
          
          <MetricCard
            title="Profit Factor"
            value={metrics.profitFactor.toFixed(2)}
            icon={BarChart3}
            trend={metrics.profitFactor > 1 ? 'positive' : 'negative'}
            description="Gross profit ÷ Gross loss"
          />
          
          <MetricCard
            title="Risk/Reward Ratio"
            value={metrics.riskRewardRatio.toFixed(2)}
            icon={TrendingUp}
            trend={metrics.riskRewardRatio > 1 ? 'positive' : 'neutral'}
            description="Average win ÷ Average loss"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Detailed Statistics</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            title="Average Win"
            value={formatCurrency(metrics.averageWin)}
            icon={TrendingUp}
            description="Average profit per winning trade"
          />
          
          <MetricCard
            title="Average Loss"
            value={formatCurrency(metrics.averageLoss)}
            icon={TrendingDown}
            description="Average loss per losing trade"
          />
          
          <MetricCard
            title="Largest Win"
            value={formatCurrency(metrics.largestWin)}
            icon={TrendingUp}
            description="Best single trade"
          />
          
          <MetricCard
            title="Largest Loss"
            value={formatCurrency(metrics.largestLoss)}
            icon={TrendingDown}
            description="Worst single trade"
          />
          
          <MetricCard
            title="Max Consecutive Wins"
            value={metrics.consecutiveWins.toString()}
            icon={Target}
            description="Longest winning streak"
          />
          
          <MetricCard
            title="Max Consecutive Losses"
            value={metrics.consecutiveLosses.toString()}
            icon={TrendingDown}
            description="Longest losing streak"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.winRate > 60 && (
              <div className="flex items-center space-x-2">
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Strong
                </Badge>
                <span className="text-sm">Excellent win rate above 60%</span>
              </div>
            )}
            
            {metrics.profitFactor > 1.5 && (
              <div className="flex items-center space-x-2">
                <Badge variant="default" className="bg-blue-100 text-blue-800">
                  Profitable
                </Badge>
                <span className="text-sm">Good profit factor indicates strong edge</span>
              </div>
            )}
            
            {metrics.riskRewardRatio > 2 && (
              <div className="flex items-center space-x-2">
                <Badge variant="default" className="bg-purple-100 text-purple-800">
                  Efficient
                </Badge>
                <span className="text-sm">Excellent risk/reward management</span>
              </div>
            )}
            
            {metrics.profitFactor < 1 && (
              <div className="flex items-center space-x-2">
                <Badge variant="destructive">
                  Warning
                </Badge>
                <span className="text-sm">Profit factor below 1 indicates losses exceed gains</span>
              </div>
            )}
            
            {metrics.winRate < 40 && (
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">
                  Attention
                </Badge>
                <span className="text-sm">Low win rate - consider reviewing strategy</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}