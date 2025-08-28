"use client";

import { useState, useEffect } from 'react';
import { JournalEntry } from '@/types/trade';
import { storage } from '@/lib/storage';

export const useJournal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadedEntries = storage.getJournalEntries();
    setEntries(loadedEntries);
    setLoading(false);
  }, []);

  const addEntry = (entry: Omit<JournalEntry, 'id'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: crypto.randomUUID()
    };
    
    const updatedEntries = [...entries, newEntry];
    setEntries(updatedEntries);
    storage.saveJournalEntries(updatedEntries);
  };

  const updateEntry = (id: string, updates: Partial<JournalEntry>) => {
    const updatedEntries = entries.map(entry => 
      entry.id === id ? { ...entry, ...updates } : entry
    );
    
    setEntries(updatedEntries);
    storage.saveJournalEntries(updatedEntries);
  };

  const deleteEntry = (id: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);
    setEntries(updatedEntries);
    storage.saveJournalEntries(updatedEntries);
  };

  return {
    entries,
    loading,
    addEntry,
    updateEntry,
    deleteEntry
  };
};