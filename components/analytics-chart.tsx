"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Trade } from '@/types/trade';
import { generateEquityCurve } from '@/lib/calculations';

interface AnalyticsChartProps {
  trades: Trade[];
}

export default function AnalyticsChart({ trades }: AnalyticsChartProps) {
  const equityCurveData = generateEquityCurve(trades);

  const closedTrades = trades.filter(trade => !trade.isOpen && trade.pnl !== null);

  // Monthly P&L data
  const monthlyData = closedTrades.reduce((acc, trade) => {
    const month = new Date(trade.exitDate!).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    acc[month] = (acc[month] || 0) + trade.pnl!;
    return acc;
  }, {} as Record<string, number>);

  const monthlyChartData = Object.entries(monthlyData).map(([month, pnl]) => ({
    month,
    pnl
  }));

  // Symbol distribution
  const symbolData = closedTrades.reduce((acc, trade) => {
    acc[trade.symbol] = (acc[trade.symbol] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const symbolChartData = Object.entries(symbolData)
    .map(([symbol, count]) => ({ symbol, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Win/Loss distribution
  const wins = closedTrades.filter(trade => trade.pnl! > 0).length;
  const losses = closedTrades.length - wins;
  const winLossData = [
    { name: 'Wins', value: wins, color: '#10B981' },
    { name: 'Losses', value: losses, color: '#EF4444' }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  if (closedTrades.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
          <CardDescription>Charts will appear here once you have closed trades.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Equity Curve</CardTitle>
          <CardDescription>Your cumulative P&L over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={equityCurveData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tickFormatter={formatCurrency} />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), 'P&L']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="pnl"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Performance</CardTitle>
            <CardDescription>P&L breakdown by month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={formatCurrency} />
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), 'P&L']}
                  />
                  <Bar
                    dataKey="pnl"
                    radius={[4, 4, 0, 0]}
                  >
                    {monthlyChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.pnl > 0 ? '#10B981' : '#EF4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Win/Loss Distribution</CardTitle>
            <CardDescription>Breakdown of winning vs losing trades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={winLossData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value, percent }) => `${name}: ${value} (${(percent as number * 100).toFixed(1)}%)`}
                  >
                    {winLossData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Most Traded Symbols</CardTitle>
          <CardDescription>Your top 10 most frequently traded symbols</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={symbolChartData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="symbol" type="category" width={60} />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}