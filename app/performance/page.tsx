import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Performance Analytics | Trade Journaling - Advanced Trading Metrics',
  description: 'Advanced trading performance analytics with equity curves, drawdown analysis, profit factor calculations, and comprehensive risk metrics for professional traders.',
  keywords: 'trading performance, equity curve, profit factor, sharpe ratio, maximum drawdown, trading analytics, risk metrics, win rate analysis',
  openGraph: {
    title: 'Trading Performance Analytics - Professional Metrics Dashboard',
    description: 'Analyze your trading performance with advanced metrics including equity curves, risk-adjusted returns, and comprehensive statistical analysis.',
    url: 'https://tradejournaling.vercel.app/performance',
  }
}

export default function PerformancePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Trading Performance Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Key Performance Metrics</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Return:</span>
              <span className="font-semibold text-green-600">+24.5%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Win Rate:</span>
              <span className="font-semibold">68.2%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Profit Factor:</span>
              <span className="font-semibold">1.85</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Sharpe Ratio:</span>
              <span className="font-semibold">1.42</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Max Drawdown:</span>
              <span className="font-semibold text-red-600">-8.3%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Risk Metrics</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Average Risk per Trade:</span>
              <span className="font-semibold">2.1%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Risk-Reward Ratio:</span>
              <span className="font-semibold">1:2.4</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Largest Loss:</span>
              <span className="font-semibold text-red-600">-$1,245</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Largest Win:</span>
              <span className="font-semibold text-green-600">+$3,180</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Consecutive Losses:</span>
              <span className="font-semibold">3</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Performance Analysis Guide</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Profitability Metrics</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Total Return: Overall account growth</li>
              <li>• Win Rate: Percentage of profitable trades</li>
              <li>• Profit Factor: Gross profit ÷ Gross loss</li>
              <li>• Average Win/Loss: Mean profit vs loss</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Risk Management</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Maximum Drawdown: Largest decline</li>
              <li>• Sharpe Ratio: Risk-adjusted returns</li>
              <li>• Risk per Trade: Position sizing</li>
              <li>• R-Multiple: Risk-reward analysis</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Consistency Metrics</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Consecutive Wins/Losses</li>
              <li>• Monthly Consistency</li>
              <li>• Volatility of Returns</li>
              <li>• Recovery Factor</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
