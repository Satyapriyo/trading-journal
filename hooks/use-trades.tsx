"use client";

import { useState, useEffect } from 'react';
import { Trade } from '@/types/trade';
import { storage } from '@/lib/storage';
import { calculatePnL } from '@/lib/calculations';

export const useTrades = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadedTrades = storage.getTrades();
    setTrades(loadedTrades);
    setLoading(false);
  }, []);

  const addTrade = (trade: Omit<Trade, 'id' | 'pnl'>) => {
    const newTrade: Trade = {
      ...trade,
      id: crypto.randomUUID(),
      pnl: trade.isOpen ? null : calculatePnL(trade as Trade)
    };

    const updatedTrades = [...trades, newTrade];
    setTrades(updatedTrades);
    storage.saveTrades(updatedTrades);
  };

  const updateTrade = (id: string, updates: Partial<Trade>) => {
    const updatedTrades = trades.map(trade => {
      if (trade.id === id) {
        const updated = { ...trade, ...updates };
        if (!updated.isOpen && updated.exitPrice) {
          updated.pnl = calculatePnL(updated);
        }
        return updated;
      }
      return trade;
    });

    setTrades(updatedTrades);
    storage.saveTrades(updatedTrades);
  };

  const deleteTrade = (id: string) => {
    const updatedTrades = trades.filter(trade => trade.id !== id);
    setTrades(updatedTrades);
    storage.saveTrades(updatedTrades);
  };

  const closeTrade = (id: string, exitPrice: number, exitDate: string) => {
    updateTrade(id, {
      exitPrice,
      exitDate,
      isOpen: false
    });
  };

  return {
    trades,
    loading,
    addTrade,
    updateTrade,
    deleteTrade,
    closeTrade
  };
};