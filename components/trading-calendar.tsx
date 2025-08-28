"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge'; // Removed unused import
import { ChevronLeft, ChevronRight, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
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
      const winRate = dayTrades.length > 0 ? (winningTrades / dayTrades.length) * 100 : 0;

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
      winRate: tradingDays > 0 ? (profitableDays / tradingDays) * 100 : 0
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
    if (pnl > 0) return 'bg-green-100 text-green-800 border-green-200';
    if (pnl < 0) return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-gray-50 text-gray-600 border-gray-200';
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

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Trading Calendar
            </CardTitle>
            <CardDescription>Daily P&L performance overview</CardDescription>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Monthly stats:</div>
              <div className="flex items-center gap-4 text-sm">
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
              <div className="px-4 py-2 text-sm font-medium min-w-[140px] text-center">
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
        <div className="flex gap-6">
          {/* Calendar */}
          <div className="flex-1">
            <div className="grid grid-cols-7 gap-1 mb-4">
              {weekDays.map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
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
                    className={cn(
                      "relative p-2 min-h-[100px] border rounded-lg transition-all hover:shadow-sm",
                      !day.isCurrentMonth && "opacity-40",
                      isToday && "ring-2 ring-blue-500",
                      hasTrades ? getPnLColor(day.pnl) : "bg-gray-50 border-gray-200"
                    )}
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex items-center justify-between mb-1">
                        <span className={cn(
                          "text-sm font-medium",
                          !day.isCurrentMonth && "text-muted-foreground"
                        )}>
                          {day.date.getDate()}
                        </span>
                        {isToday && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>

                      {hasTrades && (
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="space-y-1">
                            <div className={cn(
                              "text-sm font-bold",
                              day.pnl > 0 ? "text-green-500" : "text-red-500"
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
          <div className="w-32 space-y-1">
            <div className="text-sm font-medium text-muted-foreground mb-3">Weekly P&L</div>
            <p className='h-4'></p>
            {weeklyData.map((week, index) => (
              <div
                key={index}
                className={cn(
                  "px-3 py-[1.3rem] rounded-lg border gap-1 text-center transition-all hover:shadow-sm",
                  week.pnl > 0 ? "bg-green-50 border-green-200" :
                    week.pnl < 0 ? "bg-red-50 border-red-200" :
                      "bg-gray-50 border-gray-200"
                )}
              >
                <div className="text-xs font-medium text-muted-foreground mb-1">
                  {week.label}
                </div>
                <div className={cn(
                  "text-sm font-bold",
                  week.pnl > 0 ? "text-green-500" :
                    week.pnl < 0 ? "text-red-500" :
                      "text-gray-600"
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

        {/* Legend */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-200 rounded"></div>
              <span>Profitable day</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-200 rounded"></div>
              <span>Loss day</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-200 rounded"></div>
              <span>No trades</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
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
    </Card>
  );
}