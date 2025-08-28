export interface Trade {
  id: string;
  symbol: string;
  entryPrice: number;
  exitPrice: number | null;
  size: number; // For stocks/crypto - shares/units
  lots?: number; // For forex/commodities - lot size
  lotSize?: number; // Standard lot size (e.g., 100000 for forex, varies for commodities)
  instrumentType: 'stock' | 'forex' | 'commodity' | 'crypto';
  direction: 'long' | 'short';
  entryDate: string;
  exitDate: string | null;
  notes: string;
  tags: string[];
  screenshots: string[];
  pnl: number | null;
  commission: number;
  isOpen: boolean;
  setup: string;
  risk: number;
  reward: number;
  riskRewardRatio?: number; // Calculated from risk and reward amounts
  pipValue?: number; // For forex - value per pip
  tickSize?: number; // For commodities - minimum price movement
  tickValue?: number; // For commodities - value per tick
}

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: 'excellent' | 'good' | 'neutral' | 'bad' | 'terrible';
  tags: string[];
}

export interface PerformanceMetrics {
  totalTrades: number;
  winRate: number;
  totalPnL: number;
  averageWin: number;
  averageLoss: number;
  profitFactor: number;
  largestWin: number;
  largestLoss: number;
  consecutiveWins: number;
  consecutiveLosses: number;
  riskRewardRatio: number;
}