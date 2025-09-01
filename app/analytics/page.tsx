import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Trading Analytics Dashboard | Advanced Charts & Reports',
  description: 'Professional trading analytics dashboard with advanced charts, performance reports, equity curves, and comprehensive trade analysis. Free trading journal with institutional-grade analytics.',
  keywords: 'trading analytics, trading dashboard, equity curve, trading charts, performance reports, free trading analytics, trade analysis, profit loss charts, trading statistics',
  openGraph: {
    title: 'Advanced Trading Analytics Dashboard - Free Professional Tools',
    description: 'Comprehensive trading analytics with advanced charting, performance tracking, and detailed trade analysis. Professional-grade tools available for free.',
    url: 'https://tradejournaling.vercel.app/analytics',
  }
}

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Trading Analytics Dashboard</h1>
        <p className="text-xl text-gray-600">Professional-grade analytics for serious traders. Track performance, analyze patterns, and optimize your trading strategy.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Total P&L</h3>
          <p className="text-3xl font-bold">+$12,450</p>
          <p className="text-green-100 text-sm">+24.5% this month</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Win Rate</h3>
          <p className="text-3xl font-bold">68.2%</p>
          <p className="text-blue-100 text-sm">Above average</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Total Trades</h3>
          <p className="text-3xl font-bold">247</p>
          <p className="text-purple-100 text-sm">This quarter</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Sharpe Ratio</h3>
          <p className="text-3xl font-bold">1.42</p>
          <p className="text-orange-100 text-sm">Excellent risk-adj. return</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Equity Curve Analysis</h2>
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
            <p className="text-gray-500">Interactive Equity Curve Chart</p>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600">Starting Balance</p>
              <p className="font-semibold">$50,000</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Current Balance</p>
              <p className="font-semibold text-green-600">$62,450</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Peak Balance</p>
              <p className="font-semibold">$65,200</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Monthly Performance</h2>
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
            <p className="text-gray-500">Monthly P&L Bar Chart</p>
          </div>
          <div className="mt-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Best Month:</span>
              <span className="font-semibold text-green-600">+$8,420 (Sep)</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-600">Worst Month:</span>
              <span className="font-semibold text-red-600">-$2,130 (Jun)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Risk Metrics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Max Drawdown:</span>
              <span className="font-semibold text-red-600">-8.3%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Volatility:</span>
              <span className="font-semibold">12.4%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Calmar Ratio:</span>
              <span className="font-semibold">2.95</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Beta:</span>
              <span className="font-semibold">0.82</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Trading Patterns</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Avg Hold Time:</span>
              <span className="font-semibold">2.4 days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Best Day:</span>
              <span className="font-semibold">Tuesday</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Most Active Hour:</span>
              <span className="font-semibold">10-11 AM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Avg Position Size:</span>
              <span className="font-semibold">$2,450</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Top Performers</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Best Symbol:</span>
              <span className="font-semibold text-green-600">AAPL (+$3,240)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Best Strategy:</span>
              <span className="font-semibold">Momentum</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Best Setup:</span>
              <span className="font-semibold">Breakout</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Hit Rate:</span>
              <span className="font-semibold text-green-600">72%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">Advanced Analytics Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold text-lg mb-2">📊 Equity Curve Tracking</h4>
            <p className="text-gray-600">Visualize your account growth over time with detailed equity curve analysis, including drawdown periods and recovery phases.</p>
          </div>

          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold text-lg mb-2">📈 Performance Attribution</h4>
            <p className="text-gray-600">Break down performance by symbol, strategy, setup, and time periods to identify your most profitable trading approaches.</p>
          </div>

          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold text-lg mb-2">🎯 Risk Analysis</h4>
            <p className="text-gray-600">Comprehensive risk metrics including VaR, maximum drawdown, volatility, and risk-adjusted return calculations.</p>
          </div>

          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold text-lg mb-2">⏰ Time-Based Analysis</h4>
            <p className="text-gray-600">Analyze performance by day of week, time of day, and seasonal patterns to optimize your trading schedule.</p>
          </div>

          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold text-lg mb-2">🔍 Trade Psychology</h4>
            <p className="text-gray-600">Track emotional states, confidence levels, and psychological patterns that impact your trading decisions.</p>
          </div>

          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold text-lg mb-2">📋 Custom Reports</h4>
            <p className="text-gray-600">Generate detailed reports for tax purposes, performance reviews, and strategy optimization with exportable data.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
