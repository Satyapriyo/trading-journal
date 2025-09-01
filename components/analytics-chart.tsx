"use client";

import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { TrendingUp, TrendingDown, Target, DollarSign } from 'lucide-react';
import { Trade } from '@/types/trade';
import { generateEquityCurve } from '@/lib/calculations';

interface AnalyticsChartProps {
  trades: Trade[];
}

const equityCurveConfig = {
  pnl: {
    label: "P&L",
    color: "#10b981", // Green for positive P&L
  },
} satisfies ChartConfig;

const monthlyPerformanceConfig = {
  profit: {
    label: "Profit",
    color: "#10b981", // Green
  },
  loss: {
    label: "Loss",
    color: "#ef4444", // Red
  },
} satisfies ChartConfig;

export default function AnalyticsChart({ trades }: AnalyticsChartProps) {
  const [equityPeriod, setEquityPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const closedTrades = trades.filter(trade => !trade.isOpen && trade.pnl !== null);

  const chartData = useMemo(() => {
    const baseEquityCurveData = generateEquityCurve(trades);

    // Group equity curve data by period
    let equityCurveData = baseEquityCurveData;

    if (equityPeriod === 'weekly') {
      // Group by week
      const weeklyData = new Map();
      baseEquityCurveData.forEach(item => {
        const date = new Date(item.date);
        const weekStart = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay());
        const weekKey = weekStart.toISOString().split('T')[0];
        weeklyData.set(weekKey, item);
      });
      equityCurveData = Array.from(weeklyData.values());
    } else if (equityPeriod === 'monthly') {
      // Group by month
      const monthlyData = new Map();
      baseEquityCurveData.forEach(item => {
        const date = new Date(item.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
        monthlyData.set(monthKey, item);
      });
      equityCurveData = Array.from(monthlyData.values());
    }

    // Monthly P&L data
    const monthlyData = closedTrades.reduce((acc, trade) => {
      const month = new Date(trade.exitDate!).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      acc[month] = (acc[month] || 0) + trade.pnl!;
      return acc;
    }, {} as Record<string, number>);

    const monthlyChartData = Object.entries(monthlyData)
      .map(([month, pnl]) => ({
        month,
        pnl: Math.round(pnl),
        fill: pnl > 0 ? "#10b981" : "#ef4444" // Green for profit, red for loss
      }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

    // Symbol distribution with win/loss breakdown
    const symbolData = closedTrades.reduce((acc, trade) => {
      if (!acc[trade.symbol]) {
        acc[trade.symbol] = { total: 0, wins: 0, losses: 0 };
      }
      acc[trade.symbol].total += 1;
      if (trade.pnl! > 0) {
        acc[trade.symbol].wins += 1;
      } else {
        acc[trade.symbol].losses += 1;
      }
      return acc;
    }, {} as Record<string, { total: number; wins: number; losses: number }>);

    const symbolChartData = Object.entries(symbolData)
      .map(([symbol, data]) => ({
        symbol,
        count: data.total,
        wins: data.wins,
        losses: data.losses,
        winRate: (data.wins / data.total) * 100,
        lossRate: (data.losses / data.total) * 100,
        fill: "#3b82f6" // Blue for neutral data
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Win/Loss distribution
    const wins = closedTrades.filter(trade => trade.pnl! > 0).length;
    const losses = closedTrades.length - wins;
    const winLossData = [
      {
        name: 'Wins',
        value: wins,
        fill: "#10b981", // Green for wins
        percentage: closedTrades.length > 0 ? ((wins / closedTrades.length) * 100).toFixed(1) : '0'
      },
      {
        name: 'Losses',
        value: losses,
        fill: "#ef4444", // Red for losses
        percentage: closedTrades.length > 0 ? ((losses / closedTrades.length) * 100).toFixed(1) : '0'
      }
    ]; return {
      equityCurveData: equityCurveData.map(item => ({
        ...item,
        pnl: Math.round(item.pnl)
      })),
      monthlyChartData,
      symbolChartData,
      winLossData
    };
  }, [trades, closedTrades, equityPeriod]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const stats = useMemo(() => {
    const totalPnL = closedTrades.reduce((sum, trade) => sum + trade.pnl!, 0);
    const wins = closedTrades.filter(trade => trade.pnl! > 0).length;
    const winRate = closedTrades.length > 0 ? (wins / closedTrades.length) * 100 : 0;
    const avgWin = wins > 0 ? closedTrades.filter(trade => trade.pnl! > 0).reduce((sum, trade) => sum + trade.pnl!, 0) / wins : 0;
    const avgLoss = closedTrades.length - wins > 0 ? Math.abs(closedTrades.filter(trade => trade.pnl! < 0).reduce((sum, trade) => sum + trade.pnl!, 0)) / (closedTrades.length - wins) : 0;

    return { totalPnL, wins, winRate, avgWin, avgLoss };
  }, [closedTrades]);

  if (closedTrades.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Analytics Dashboard
          </CardTitle>
          <CardDescription>
            Charts and insights will appear here once you have closed trades.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            Start trading to see your analytics
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Total P&L</span>
            </div>
            <div className={`text-2xl font-bold ${stats.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(stats.totalPnL)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Win Rate</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {stats.winRate.toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Avg Win</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.avgWin)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Avg Loss</span>
            </div>
            <div className="text-2xl font-bold text-red-600">
              -{formatCurrency(stats.avgLoss)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Equity Curve */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Equity Curve</CardTitle>
              <CardDescription>
                Your cumulative P&L performance over time
              </CardDescription>
            </div>
            <Select value={equityPeriod} onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setEquityPeriod(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={equityCurveConfig}>
            <AreaChart
              accessibilityLayer
              data={chartData.equityCurveData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  if (equityPeriod === 'monthly') {
                    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                  } else if (equityPeriod === 'weekly') {
                    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  } else {
                    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  }
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={formatCurrency}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
                formatter={(value) => [formatCurrency(value as number), "P&L"]}
                labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              />
              <Area
                dataKey="pnl"
                type="natural"
                fill="url(#fillPnl)"
                fillOpacity={0.4}
                stroke={stats.totalPnL >= 0 ? "#10b981" : "#ef4444"}
                strokeWidth={2}
                stackId="a"
              />
              <defs>
                <linearGradient id="fillPnl" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={stats.totalPnL >= 0 ? "#10b981" : "#ef4444"}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={stats.totalPnL >= 0 ? "#10b981" : "#ef4444"}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Monthly Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Performance</CardTitle>
            <CardDescription>P&L breakdown by month</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={monthlyPerformanceConfig}>
              <BarChart
                accessibilityLayer
                data={chartData.monthlyChartData}
                layout="horizontal"
                margin={{
                  left: 60,
                  right: 12,
                }}
              >
                <CartesianGrid horizontal={false} />
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={formatCurrency}
                />
                <YAxis
                  type="category"
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                  formatter={(value) => [formatCurrency(value as number), "P&L"]}
                />
                <Bar dataKey="pnl" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Win/Loss Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Win/Loss Distribution</CardTitle>
            <CardDescription>Breakdown of winning vs losing trades</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={{
                wins: {
                  label: "Wins",
                  color: "hsl(var(--chart-1))",
                },
                losses: {
                  label: "Losses",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                  formatter={(value, name) => [
                    `${value} trades (${chartData.winLossData.find(d => d.name === name)?.percentage}%)`,
                    name
                  ]}
                />
                <Pie
                  data={chartData.winLossData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  strokeWidth={5}
                >
                  {chartData.winLossData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Most Traded Symbols */}
      <Card>
        <CardHeader>
          <CardTitle>Most Traded Symbols</CardTitle>
          <CardDescription>Your top 10 most frequently traded symbols with win/loss distribution</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {chartData.symbolChartData.map((item, index) => (
            <div key={index} className="group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">{item.symbol}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.count} total trades
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-foreground">
                    {item.winRate.toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground">win rate</div>
                </div>
              </div>

              <div className="relative">
                <div className="flex h-10 rounded-lg overflow-hidden shadow-sm border border-border bg-background">
                  {/* Wins section */}
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center text-sm font-semibold text-white transition-all duration-300 hover:from-emerald-600 hover:to-green-600"
                    style={{ width: `${(item.wins / item.count) * 100}%` }}
                  >
                    {item.wins > 0 && item.wins > item.count * 0.15 && (
                      <span className="flex items-center gap-1">
                        <span>🎯</span>
                        <span>{item.wins}W</span>
                      </span>
                    )}
                  </div>

                  {/* Losses section */}
                  <div
                    className="bg-gradient-to-r from-red-500 to-rose-500 flex items-center justify-center text-sm font-semibold text-white transition-all duration-300 hover:from-red-600 hover:to-rose-600"
                    style={{ width: `${(item.losses / item.count) * 100}%` }}
                  >
                    {item.losses > 0 && item.losses > item.count * 0.15 && (
                      <span className="flex items-center gap-1">
                        <span>💥</span>
                        <span>{item.losses}L</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Hover tooltip */}
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-2 px-3 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                  <div className="text-center">
                    <div className="text-green-400">✓ {item.wins} Wins ({((item.wins / item.count) * 100).toFixed(1)}%)</div>
                    <div className="text-red-400">✗ {item.losses} Losses ({((item.losses / item.count) * 100).toFixed(1)}%)</div>
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-3 pt-3 border-t border-border/50">
                <div className="flex gap-4">
                  <div className="flex items-center gap-1 text-sm">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-500 to-green-500"></div>
                    <span className="text-muted-foreground">Wins:</span>
                    <span className="font-semibold text-green-600">{item.wins}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-rose-500"></div>
                    <span className="text-muted-foreground">Losses:</span>
                    <span className="font-semibold text-red-600">{item.losses}</span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Rank #{index + 1}
                </div>
              </div>
            </div>
          ))}

          {chartData.symbolChartData.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                <Target className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No Trading Data</h3>
              <p className="text-muted-foreground">Start trading to see your most traded symbols</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}