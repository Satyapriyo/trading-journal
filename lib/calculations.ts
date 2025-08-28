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

    const lots = trade.lots || 1;
    // const lotSize = trade.lotSize || 100000; // Standard lot - Removed unused variable
    const pipValue = trade.pipValue || 10; // Default $10 per pip for standard lot

    // Convert price difference to pips (assuming 4-decimal pairs like EUR/USD)
    const pips = pipDifference * 10000;
    pnl = pips * pipValue * lots;
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
