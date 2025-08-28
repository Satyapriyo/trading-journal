import { Trade, JournalEntry } from '@/types/trade';

const TRADES_KEY = 'trade-journal-trades';
const JOURNAL_KEY = 'trade-journal-entries';

export const storage = {
  getTrades: (): Trade[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(TRADES_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveTrades: (trades: Trade[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TRADES_KEY, JSON.stringify(trades));
  },

  getJournalEntries: (): JournalEntry[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(JOURNAL_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveJournalEntries: (entries: JournalEntry[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
  },

  exportData: () => {
    const trades = storage.getTrades();
    const journal = storage.getJournalEntries();
    return {
      trades,
      journal,
      exportDate: new Date().toISOString()
    };
  },

  importData: (data: { trades: Trade[], journal: JournalEntry[] }) => {
    storage.saveTrades(data.trades);
    storage.saveJournalEntries(data.journal);
  }
};