"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar, TrendingUp, TrendingDown, Target, DollarSign } from 'lucide-react';
import { Trade } from '@/types/trade';
import { cn } from '@/lib/utils';

interface TradingCalendarProps {
  trades: Trade[];
}

interface DayData {
  date: Date;
  pnl: number;
  trades: number;
  winRate: number;
  isCurrentMonth: boolean;
}

interface WeekData {
  weekNumber: number;
  pnl: number;
  days: number;
  label: string;
}

export default function TradingCalendar({ trades }: TradingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { calendarData, weeklyData } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Get first day of month and last day of month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Get first day of calendar (might be from previous month)
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    // Get last day of calendar (might be from next month)
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

    const days: DayData[] = [];
    const weeks: WeekData[] = [];
    const currentDateIter = new Date(startDate);

    let weekNumber = 1;
    let weekPnL = 0;
    let weekDays = 0;

    while (currentDateIter <= endDate) {
      const dateStr = currentDateIter.toISOString().split('T')[0];

      // Filter trades for this day
      const dayTrades = trades.filter(trade => {
        if (!trade.exitDate || trade.isOpen) return false;
        const tradeDate = new Date(trade.exitDate).toISOString().split('T')[0];
        return tradeDate === dateStr;
      });

      const dayPnL = dayTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
      const winningTrades = dayTrades.filter(trade => (trade.pnl || 0) > 0).length;
      const winRate = dayTrades.length > 0 ? Number(((winningTrades / dayTrades.length) * 100).toFixed(1)) : 0;

      days.push({
        date: new Date(currentDateIter),
        pnl: dayPnL,
        trades: dayTrades.length,
        winRate,
        isCurrentMonth: currentDateIter.getMonth() === month
      });

      // Add to weekly totals
      if (dayTrades.length > 0) {
        weekPnL += dayPnL;
        weekDays++;
      }

      // If it's Saturday or the last day, complete the week
      if (currentDateIter.getDay() === 6 || currentDateIter.getTime() === endDate.getTime()) {
        weeks.push({
          weekNumber,
          pnl: weekPnL,
          days: weekDays,
          label: `Week ${weekNumber}`
        });
        weekNumber++;
        weekPnL = 0;
        weekDays = 0;
      }

      currentDateIter.setDate(currentDateIter.getDate() + 1);
    }

    return { calendarData: days, weeklyData: weeks };
  }, [trades, currentDate]);

  const monthlyStats = useMemo(() => {
    const monthTrades = calendarData.filter(day => day.isCurrentMonth && day.trades > 0);
    const totalPnL = monthTrades.reduce((sum, day) => sum + day.pnl, 0);
    const totalTrades = monthTrades.reduce((sum, day) => sum + day.trades, 0);
    const profitableDays = monthTrades.filter(day => day.pnl > 0).length;
    const tradingDays = monthTrades.length;

    return {
      totalPnL,
      totalTrades,
      tradingDays,
      profitableDays,
      winRate: tradingDays > 0 ? Number(((profitableDays / tradingDays) * 100).toFixed(1)) : 0
    };
  }, [calendarData]);

  const formatCurrency = (amount: number) => {
    const absAmount = Math.abs(amount);
    if (absAmount >= 1000) {
      return `${amount < 0 ? '-' : ''}$${(absAmount / 1000).toFixed(1)}K`;
    }
    return `$${amount.toFixed(0)}`;
  };

  const formatCurrencyFull = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getPnLColor = (pnl: number) => {
    if (pnl > 0) return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
    if (pnl < 0) return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
    return 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleDayClick = (day: DayData) => {
    if (day.trades > 0) {
      setSelectedDay(day);
      setIsDrawerOpen(true);
    }
  };

  const getTradesForDay = (day: DayData) => {
    const dateStr = day.date.toISOString().split('T')[0];
    return trades.filter(trade => {
      if (!trade.exitDate || trade.isOpen) return false;
      const tradeDate = new Date(trade.exitDate).toISOString().split('T')[0];
      return tradeDate === dateStr;
    });
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Trading Calendar
            </CardTitle>
            <CardDescription>Daily P&L performance overview</CardDescription>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="text-left sm:text-right">
              <div className="text-sm text-muted-foreground">Monthly stats:</div>
              <div className="flex items-center gap-4 text-sm flex-wrap">
                <span className={cn("font-bold text-lg", monthlyStats.totalPnL > 0 ? "text-green-600" : "text-red-600")}>
                  {formatCurrencyFull(monthlyStats.totalPnL)}
                </span>
                <span className="text-muted-foreground">{monthlyStats.tradingDays} days</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="px-3 sm:px-4 py-2 text-sm font-medium min-w-[120px] sm:min-w-[140px] text-center">
                {monthName}
              </div>
              <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col xl:flex-row gap-6">
          {/* Calendar */}
          <div className="flex-1">
            <div className="grid grid-cols-7 gap-1 mb-4">
              {weekDays.map(day => (
                <div key={day} className="p-1 sm:p-2 text-center text-xs sm:text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarData.map((day, index) => {
                const isToday = day.date.toDateString() === new Date().toDateString();
                const hasTrades = day.trades > 0;

                return (
                  <div
                    key={index}
                    onClick={() => handleDayClick(day)}
                    className={cn(
                      "relative p-1 sm:p-2 min-h-[60px] sm:min-h-[80px] lg:min-h-[100px] border rounded-lg transition-all hover:shadow-sm",
                      !day.isCurrentMonth && "opacity-40",
                      isToday && "ring-1 sm:ring-2 ring-blue-500 dark:ring-blue-400",
                      hasTrades ? getPnLColor(day.pnl) + " cursor-pointer hover:shadow-md" : "bg-gray-50 border-gray-200 dark:bg-slate-800 dark:border-slate-700"
                    )}
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex items-center justify-between mb-1">
                        <span className={cn(
                          "text-xs sm:text-sm font-medium",
                          !day.isCurrentMonth && "text-muted-foreground",
                          day.isCurrentMonth && "dark:text-slate-200"
                        )}>
                          {day.date.getDate()}
                        </span>
                        {isToday && (
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>

                      {hasTrades && (
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="space-y-0.5 sm:space-y-1">
                            <div className={cn(
                              "text-xs sm:text-sm font-bold",
                              day.pnl > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                            )}>
                              {formatCurrency(day.pnl)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {day.trades} trade{day.trades !== 1 ? 's' : ''}
                            </div>
                          </div>

                          <div className="text-xs text-muted-foreground">
                            {day.winRate.toFixed(0)}%
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Weekly Summary */}
          <div className="w-full xl:w-32 space-y-1">
            <div className="text-sm font-medium text-muted-foreground mb-3">Weekly P&L</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-1 gap-2 xl:gap-1">
              <div className="xl:h-4"></div>
              {weeklyData.map((week, index) => (
                <div
                  key={index}
                  className={cn(
                    "px-2 sm:px-3 py-2 sm:py-[1.3rem] xl:py-[1.3rem] rounded-lg border text-center transition-all hover:shadow-sm",
                    week.pnl > 0 ? "bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-800" :
                      week.pnl < 0 ? "bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-red-800" :
                        "bg-gray-50 border-gray-200 dark:bg-slate-800 dark:border-slate-700"
                  )}
                >
                  <div className="text-xs font-medium text-muted-foreground mb-1">
                    {week.label}
                  </div>
                  <div className={cn(
                    "text-xs sm:text-sm font-bold",
                    week.pnl > 0 ? "text-green-600 dark:text-green-400" :
                      week.pnl < 0 ? "text-red-600 dark:text-red-400" :
                        "text-gray-600 dark:text-slate-300"
                  )}>
                    {formatCurrency(week.pnl)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {week.days} day{week.days !== 1 ? 's' : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-6 pt-4 border-t dark:border-slate-700 gap-4 sm:gap-0">
          <div className="flex items-center gap-2 sm:gap-4 text-xs text-muted-foreground flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-200 dark:bg-green-800 rounded"></div>
              <span>Profitable day</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-200 dark:bg-red-800 rounded"></div>
              <span>Loss day</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-200 dark:bg-slate-600 rounded"></div>
              <span>No trades</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 text-sm flex-wrap">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-green-600 font-medium">{monthlyStats.profitableDays}</span>
              <span className="text-muted-foreground">profitable days</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingDown className="h-4 w-4 text-red-600" />
              <span className="text-red-600 font-medium">{monthlyStats.tradingDays - monthlyStats.profitableDays}</span>
              <span className="text-muted-foreground">loss days</span>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Day Detail Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {selectedDay && selectedDay.date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </DrawerTitle>
            <DrawerDescription>
              Trading performance and trade details for this day
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 pb-4 overflow-y-auto">
            {selectedDay && (
              <div className="space-y-6">
                {/* Day Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Total P&L</span>
                      </div>
                      <div className={cn(
                        "text-2xl font-bold mt-1",
                        selectedDay.pnl > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      )}>
                        {formatCurrencyFull(selectedDay.pnl)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Total Trades</span>
                      </div>
                      <div className="text-2xl font-bold mt-1 text-blue-600 dark:text-blue-400">
                        {selectedDay.trades}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Win Rate</span>
                      </div>
                      <div className="text-2xl font-bold mt-1 text-blue-600 dark:text-blue-400">
                        {selectedDay.winRate.toFixed(1)}%
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Trades List */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Trades</h3>
                  <div className="space-y-3">
                    {getTradesForDay(selectedDay).map((trade) => (
                      <Card key={trade.id} className="border-l-4" style={{
                        borderLeftColor: (trade.pnl || 0) > 0 ? '#10b981' : '#ef4444'
                      }}>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            {/* Trade Header */}
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="outline" className="font-mono bg-blue-50 text-blue-700 border-blue-200">
                                  {trade.symbol}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={trade.direction === 'long' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}
                                >
                                  {trade.direction.toUpperCase()}
                                </Badge>
                                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                                  {trade.setup}
                                </span>
                              </div>

                              <div className={cn(
                                "text-lg font-bold",
                                (trade.pnl || 0) > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                              )}>
                                {formatCurrencyFull(trade.pnl || 0)}
                              </div>
                            </div>

                            {/* Trade Details */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <div className="text-muted-foreground">Entry Price</div>
                                <div className="font-mono font-medium">${trade.entryPrice}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Exit Price</div>
                                <div className="font-mono font-medium">${trade.exitPrice}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Position Size</div>
                                <div className="font-medium">{trade.size} units</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Entry Time</div>
                                <div className="font-medium">{new Date(trade.entryDate).toLocaleTimeString()}</div>
                              </div>
                            </div>

                            {trade.notes && (
                              <div className="pt-3 border-t dark:border-slate-700">
                                <div className="text-sm text-muted-foreground mb-1">Notes:</div>
                                <div className="text-sm bg-gray-50 dark:bg-slate-800 p-2 rounded">{trade.notes}</div>
                              </div>
                            )}

                            {trade.tags && trade.tags.length > 0 && (
                              <div className="flex gap-2 flex-wrap">
                                {trade.tags.map((tag, index) => (
                                  <Badge key={index} variant="outline" className="text-xs bg-blue-50 dark:bg-gray-700 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-gray-600">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </Card>
  );
}