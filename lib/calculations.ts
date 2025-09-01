import { Trade, PerformanceMetrics } from "@/types/trade";

export const calculatePnL = (trade: Trade): number => {
  if (!trade.exitPrice) return 0;

  let pnl = 0;

  if (trade.instrumentType === "forex") {
    // Forex P&L calculation
    const pipDifference =
      trade.direction === "long"
        ? trade.exitPrice - trade.entryPrice
        : trade.entryPrice - trade.exitPrice;

    const lots = trade.lots || 1; // Number of lots (e.g., 0.1, 1, 2)
    const lotSize = trade.lotSize || 100000; // Units per lot (standard = 100,000)

    // Calculate pip value based on lot size and currency pair
    // For USD pairs: Pip Value = (0.0001 / Exchange Rate) * Lot Size * Number of Lots
    // For pairs ending in USD: Pip Value = 0.0001 * Lot Size * Number of Lots
    let pipValue = trade.pipValue;

    if (!pipValue) {
      // Default pip value calculation for USD pairs
      if (trade.symbol.endsWith("USD")) {
        // For pairs like EUR/USD, GBP/USD
        pipValue = 0.0001 * lotSize * lots;
      } else if (trade.symbol.startsWith("USD")) {
        // For pairs like USD/JPY, USD/CHF
        // This is simplified - in reality you'd need the current exchange rate
        pipValue = (0.0001 / trade.exitPrice) * lotSize * lots;
      } else {
        // Cross pairs - simplified calculation
        pipValue = 0.0001 * lotSize * lots;
      }
    }

    // Convert price difference to pips
    let pips = 0;
    if (trade.symbol.includes("JPY")) {
      // JPY pairs have 2 decimal places, so pip = 0.01
      pips = pipDifference * 100;
    } else {
      // Most pairs have 4 decimal places, so pip = 0.0001
      pips = pipDifference * 10000;
    }

    pnl = pips * (pipValue / (lotSize * lots)); // Normalize pip value
  } else if (trade.instrumentType === "commodity") {
    // Commodity P&L calculation
    const priceDifference =
      trade.direction === "long"
        ? trade.exitPrice - trade.entryPrice
        : trade.entryPrice - trade.exitPrice;

    const lots = trade.lots || 1;
    const tickValue = trade.tickValue || 50; // Default tick value
    const tickSize = trade.tickSize || 0.25; // Default tick size

    const ticks = priceDifference / tickSize;
    pnl = ticks * tickValue * lots;
  } else {
    // Stock/Crypto P&L calculation (existing logic)
    pnl =
      trade.direction === "long"
        ? (trade.exitPrice - trade.entryPrice) * trade.size
        : (trade.entryPrice - trade.exitPrice) * trade.size;
  }

  return pnl - trade.commission;
};

export const calculateRiskRewardRatio = (
  risk: number,
  reward: number
): number => {
  if (risk <= 0) return 0;
  return reward / risk;
};

// Calculate risk-reward ratio for forex trades based on entry, stop loss, and take profit
export const calculateForexRiskReward = (
  entryPrice: number,
  stopLoss: number,
  takeProfit: number,
  direction: "long" | "short"
): { risk: number; reward: number; ratio: number } => {
  let risk = 0;
  let reward = 0;

  if (direction === "long") {
    risk = Math.abs(entryPrice - stopLoss);
    reward = Math.abs(takeProfit - entryPrice);
  } else {
    risk = Math.abs(stopLoss - entryPrice);
    reward = Math.abs(entryPrice - takeProfit);
  }

  const ratio = risk > 0 ? reward / risk : 0;

  return { risk, reward, ratio };
};

// Calculate lot size based on risk percentage and stop loss
export const calculateForexLotSize = (
  accountBalance: number,
  riskPercentage: number, // e.g., 2 for 2%
  entryPrice: number,
  stopLoss: number,
  pipValue: number = 10 // Default for standard lot
): number => {
  const riskAmount = (accountBalance * riskPercentage) / 100;

  let pipsAtRisk = 0;
  const priceDifference = Math.abs(entryPrice - stopLoss);

  // Calculate pips at risk based on currency pair
  if (entryPrice > 10) {
    // Likely JPY pair (2 decimal places)
    pipsAtRisk = priceDifference * 100;
  } else {
    // Most other pairs (4 decimal places)
    pipsAtRisk = priceDifference * 10000;
  }

  if (pipsAtRisk === 0) return 0;

  // Lot size = Risk Amount / (Pips at Risk × Pip Value)
  const calculatedLots = riskAmount / (pipsAtRisk * pipValue);

  return Math.round(calculatedLots * 100) / 100; // Round to 2 decimal places
};

export const calculateMetrics = (trades: Trade[]): PerformanceMetrics => {
  const closedTrades = trades.filter(
    (trade) => !trade.isOpen && trade.pnl !== null
  );

  if (closedTrades.length === 0) {
    return {
      totalTrades: 0,
      winRate: 0,
      totalPnL: 0,
      averageWin: 0,
      averageLoss: 0,
      profitFactor: 0,
      largestWin: 0,
      largestLoss: 0,
      consecutiveWins: 0,
      consecutiveLosses: 0,
      riskRewardRatio: 0,
    };
  }

  const wins = closedTrades.filter((trade) => trade.pnl! > 0);
  const losses = closedTrades.filter((trade) => trade.pnl! < 0);

  const totalPnL = closedTrades.reduce((sum, trade) => sum + trade.pnl!, 0);
  const totalWins = wins.reduce((sum, trade) => sum + trade.pnl!, 0);
  const totalLosses = Math.abs(
    losses.reduce((sum, trade) => sum + trade.pnl!, 0)
  );

  const winRate = (wins.length / closedTrades.length) * 100;
  const averageWin = wins.length > 0 ? totalWins / wins.length : 0;
  const averageLoss = losses.length > 0 ? totalLosses / losses.length : 0;
  const profitFactor = totalLosses > 0 ? totalWins / totalLosses : 0;

  const largestWin = wins.length > 0 ? Math.max(...wins.map((t) => t.pnl!)) : 0;
  const largestLoss =
    losses.length > 0 ? Math.min(...losses.map((t) => t.pnl!)) : 0;

  // Calculate consecutive streaks
  let consecutiveWins = 0;
  let consecutiveLosses = 0;
  let currentWinStreak = 0;
  let currentLossStreak = 0;

  closedTrades.forEach((trade) => {
    if (trade.pnl! > 0) {
      currentWinStreak++;
      currentLossStreak = 0;
      consecutiveWins = Math.max(consecutiveWins, currentWinStreak);
    } else {
      currentLossStreak++;
      currentWinStreak = 0;
      consecutiveLosses = Math.max(consecutiveLosses, currentLossStreak);
    }
  });

  const riskRewardRatio = averageLoss > 0 ? averageWin / averageLoss : 0;

  return {
    totalTrades: closedTrades.length,
    winRate,
    totalPnL,
    averageWin,
    averageLoss,
    profitFactor,
    largestWin,
    largestLoss,
    consecutiveWins,
    consecutiveLosses,
    riskRewardRatio,
  };
};

export const generateEquityCurve = (trades: Trade[]) => {
  const closedTrades = trades
    .filter((trade) => !trade.isOpen && trade.pnl !== null)
    .sort(
      (a, b) =>
        new Date(a.exitDate!).getTime() - new Date(b.exitDate!).getTime()
    );

  let runningTotal = 0;
  return closedTrades.map((trade) => {
    runningTotal += trade.pnl!;
    return {
      date: new Date(trade.exitDate!).toLocaleDateString(),
      pnl: runningTotal,
      trade: trade.symbol,
    };
  });
};
