"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Upload, FileText, Database, AlertCircle } from 'lucide-react';
import { Trade, JournalEntry } from '@/types/trade';
import { storage } from '@/lib/storage';

interface ExportImportProps {
  trades: Trade[];
  journalEntries: JournalEntry[];
}

// Parse broker account history CSV format
const parseBrokerAccountHistory = (lines: string[]): Trade[] => {
  const trades: Trade[] = [];
  const tradeMap = new Map<string, {
    entry: {
      time: string;
      symbol: string;
      direction: 'long' | 'short';
      price: number;
      units: number;
      action: string;
    };
    exit?: {
      time: string;
      price: number;
      pnl: number;
      action: string;
    }
  }>();

  console.log('Processing broker CSV with', lines.length, 'lines');
  console.log('Header:', lines[0]);

  // Process lines in reverse order since CSV is newest first, but we need entries before exits
  const dataLines = lines.slice(1).reverse();

  dataLines.forEach((line, index) => {
    if (!line.trim()) return;

    // Handle CSV parsing with quoted fields
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim()); // Push the last value

    if (values.length < 6) return;

    const time = values[0];
    const pnl = parseFloat(values[3]) || 0;
    let action = values[5] || '';

    // Remove surrounding quotes if present
    if (action.startsWith('"') && action.endsWith('"')) {
      action = action.slice(1, -1);
    }

    console.log(`Line ${index + 1}:`, { time, pnl, action: action.substring(0, 100) + '...' });

    // Skip pure commission entries (those that don't involve position changes)
    if (action.includes('Commission for:') && !action.includes('Enter position') && !action.includes('Close')) {
      console.log('Skipping pure commission entry');
      return;
    }

    // Extract trade details from action description
    const symbolMatch = action.match(/symbol ([A-Z:]+)/);
    const priceMatch = action.match(/price ([\d.]+)/);
    const unitsMatch = action.match(/for ([\d.]+) units/);
    const avgPriceMatch = action.match(/AVG Price was ([\d.]+)/);

    console.log('Regex matches:', { symbolMatch, priceMatch, unitsMatch, avgPriceMatch });

    if (!symbolMatch || !priceMatch || !unitsMatch) {
      console.log('Missing required matches, skipping line');
      return;
    }

    const symbol = symbolMatch[1].replace(/^(FX:|OANDA:|PEPPERSTONE:|SPREADEX:)/, '');
    const price = parseFloat(priceMatch[1]);
    const units = parseFloat(unitsMatch[1]);
    const avgPrice = avgPriceMatch ? parseFloat(avgPriceMatch[1]) : price;

    // Determine if it's an entry or exit based on the actual CSV format
    // Handle both direct actions and commission entries that contain position info
    const isEntry = action.includes('Enter position') || (action.includes('Commission for:') && action.includes('Enter position'));
    const isClose = action.includes('Close') && (action.includes('Close long position') || action.includes('Close short position'));
    const isLong = action.includes('long position');
    const isShort = action.includes('short position');

    console.log('Trade details:', { symbol, price, units, avgPrice, isEntry, isClose, isLong, isShort });

    // Create a more specific trade key that includes direction and approximate units
    const direction = isLong ? 'long' : 'short';
    const roundedUnits = Math.round(units / 1000) * 1000; // Round to nearest thousand for matching
    const tradeKey = `${symbol}_${direction}_${roundedUnits}`;

    if (isEntry) {
      console.log('Setting entry for trade:', tradeKey);
      tradeMap.set(tradeKey, {
        entry: {
          time,
          symbol,
          direction: direction,
          price: avgPrice || price,
          units,
          action
        }
      });
    } else if (isClose) {
      // For close positions, try to find the best matching entry
      let matchingKey = null;
      let bestMatch = null;
      let smallestUnitsDiff = Infinity;

      // Look for exact match first
      if (tradeMap.has(tradeKey)) {
        matchingKey = tradeKey;
      } else {
        // Look for closest match by symbol, direction and similar unit size
        for (const key of tradeMap.keys()) {
          const [keySymbol, keyDirection, keyUnits] = key.split('_');
          if (keySymbol === symbol && keyDirection === direction) {
            const unitsDiff = Math.abs(parseInt(keyUnits) - roundedUnits);
            if (unitsDiff < smallestUnitsDiff) {
              smallestUnitsDiff = unitsDiff;
              bestMatch = key;
            }
          }
        }
        matchingKey = bestMatch;
      }

      if (matchingKey && tradeMap.has(matchingKey)) {
        console.log('Closing trade:', matchingKey);
        const existingTrade = tradeMap.get(matchingKey)!;

        // Create complete trade
        const trade: Trade = {
          id: crypto.randomUUID(),
          symbol: existingTrade.entry.symbol,
          direction: existingTrade.entry.direction,
          entryPrice: existingTrade.entry.price,
          exitPrice: avgPrice || price, // Use avgPrice for exit if available
          entryDate: new Date(existingTrade.entry.time).toISOString(),
          exitDate: new Date(time).toISOString(),
          pnl: pnl,
          commission: 0, // Commission is tracked separately
          isOpen: false,
          notes: `Auto-imported from broker history`,
          tags: ['imported', 'broker-history'],
          screenshots: [],
          setup: 'Imported',
          risk: 0,
          reward: 0,
          size: Math.round(Math.abs(units)),
          lots: Number((Math.abs(units) / 100000).toFixed(2)), // Convert units to lots for forex
          lotSize: 100000,
          instrumentType: symbol.includes('JPY') || symbol.includes('USD') || symbol.includes('EUR') || symbol.includes('GBP') ? 'forex' :
            symbol.includes('NAS') || symbol.includes('SPX') || symbol.includes('NIKKEI') ? 'commodity' : 'stock'
        };

        console.log('Created trade:', trade);
        trades.push(trade);
        tradeMap.delete(matchingKey);
      } else {
        console.log('No matching entry found for close action:', tradeKey);
      }
    }
  });

  console.log('Final trades array:', trades);
  console.log('Remaining unmatched entries:', Array.from(tradeMap.keys()));
  return trades;
};

export default function ExportImport({ trades, journalEntries }: ExportImportProps) {
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importMessage, setImportMessage] = useState('');

  const exportToCSV = () => {
    // Create CSV content for trades
    const headers = [
      'Date', 'Symbol', 'Direction', 'Entry Price', 'Exit Price', 'Size',
      'P&L', 'Commission', 'Status', 'Setup', 'Risk', 'Reward', 'Notes', 'Tags'
    ];

    const csvContent = [
      headers.join(','),
      ...trades.map(trade => [
        trade.entryDate,
        trade.symbol,
        trade.direction,
        trade.entryPrice,
        trade.exitPrice || '',
        trade.size,
        trade.pnl || '',
        trade.commission,
        trade.isOpen ? 'Open' : 'Closed',
        trade.setup,
        trade.risk,
        trade.reward,
        `"${trade.notes.replace(/"/g, '""')}"`,
        `"${trade.tags.join(';')}"`,
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trading-journal-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    const data = storage.exportData();
    const jsonContent = JSON.stringify(data, null, 2);

    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trading-journal-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    if (!importFile) return;

    try {
      const text = await importFile.text();

      if (importFile.name.endsWith('.json')) {
        const data = JSON.parse(text);

        // Validate the data structure
        if (!data.trades || !Array.isArray(data.trades) || !data.journal || !Array.isArray(data.journal)) {
          throw new Error('Invalid JSON format. Expected trades and journal arrays.');
        }

        storage.importData(data);
        setImportStatus('success');
        setImportMessage(`Successfully imported ${data.trades.length} trades and ${data.journal.length} journal entries. Please refresh the page to see the changes.`);

      } else if (importFile.name.endsWith('.csv')) {
        // Parse CSV and convert to trade format
        const lines = text.split('\n');
        const headers = lines[0].split(',');

        // Check if this is a broker account history CSV (Time,Balance Before,Balance After,Realized P&L,Currency,Action)
        if (headers.includes('Time') && headers.includes('Action') && headers.includes('Realized P&L (value)')) {
          const trades = parseBrokerAccountHistory(lines);

          // Get existing trades to avoid duplicates
          const existingTrades = storage.getTrades();
          const existingTradeHashes = new Set(existingTrades.map(t =>
            `${t.symbol}_${t.entryDate}_${t.exitDate}_${t.entryPrice}_${t.exitPrice}`
          ));

          const newTrades = trades.filter(trade =>
            !existingTradeHashes.has(`${trade.symbol}_${trade.entryDate}_${trade.exitDate}_${trade.entryPrice}_${trade.exitPrice}`)
          );

          if (newTrades.length > 0) {
            storage.saveTrades([...existingTrades, ...newTrades]);
            setImportStatus('success');
            setImportMessage(`Successfully imported ${newTrades.length} new trades from broker history. Please refresh the page to see the changes.`);
          } else {
            setImportStatus('success');
            setImportMessage('No new trades found. All trades in the CSV already exist.');
          }
        } else {
          // Original CSV format parsing
          const trades: Trade[] = lines.slice(1)
            .filter(line => line.trim())
            .map((line) => {
              const values = line.split(',');

              return {
                id: crypto.randomUUID(),
                symbol: values[1] || '',
                direction: (values[2] || 'long') as 'long' | 'short',
                entryPrice: parseFloat(values[3]) || 0,
                exitPrice: values[4] ? parseFloat(values[4]) : null,
                size: parseInt(values[5]) || 0,
                entryDate: values[0] || new Date().toISOString(),
                exitDate: values[4] ? values[0] : null,
                notes: values[12] ? values[12].replace(/"/g, '') : '',
                tags: values[13] ? values[13].replace(/"/g, '').split(';').filter(Boolean) : [],
                screenshots: [],
                pnl: values[6] ? parseFloat(values[6]) : null,
                commission: parseFloat(values[7]) || 0,
                isOpen: values[8] === 'Open',
                setup: values[9] || '',
                risk: parseFloat(values[10]) || 0,
                reward: parseFloat(values[11]) || 0,
                instrumentType: 'stock',
              };
            });

          storage.saveTrades(trades);
          setImportStatus('success');
          setImportMessage(`Successfully imported ${trades.length} trades from CSV. Please refresh the page to see the changes.`);
        }
      } else {
        throw new Error('Unsupported file format. Please upload a JSON or CSV file.');
      }

    } catch (error) {
      setImportStatus('error');
      setImportMessage(error instanceof Error ? error.message : 'Failed to import data. Please check your file format.');
    }
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.removeItem('trade-journal-trades');
      localStorage.removeItem('trade-journal-entries');
      setImportStatus('success');
      setImportMessage('All data has been cleared. Please refresh the page.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Export & Import</h2>
        <p className="text-muted-foreground">Backup your data or import from other sources</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Export Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export Data
            </CardTitle>
            <CardDescription>
              Download your trading data for backup or analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button onClick={exportToJSON} className="w-full justify-start" variant="outline">
                <Database className="h-4 w-4 mr-2" />
                Export as JSON (Full Backup)
                <span className="text-xs text-muted-foreground ml-auto">
                  {trades.length} trades, {journalEntries.length} entries
                </span>
              </Button>

              <Button onClick={exportToCSV} className="w-full justify-start" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Export Trades as CSV
                <span className="text-xs text-muted-foreground ml-auto">
                  {trades.length} trades
                </span>
              </Button>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>JSON:</strong> Complete backup including trades and journal entries</p>
              <p><strong>CSV:</strong> Trade data only, compatible with Excel and Google Sheets</p>
            </div>
          </CardContent>
        </Card>

        {/* Import Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Import Data
            </CardTitle>
            <CardDescription>
              Restore from backup or import from other sources
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label htmlFor="import-file">Select File</Label>
                <Input
                  id="import-file"
                  type="file"
                  accept=".json,.csv"
                  onChange={(e) => {
                    setImportFile(e.target.files?.[0] || null);
                    setImportStatus('idle');
                  }}
                  className="mt-1"
                />
              </div>

              <Button
                onClick={handleImport}
                disabled={!importFile}
                className="w-full"
              >
                Import Data
              </Button>
            </div>

            {importStatus !== 'idle' && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {importMessage}
                </AlertDescription>
              </Alert>
            )}

            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>Supported formats:</strong> JSON (full backup), CSV (trades only)</p>
              <p><strong>Note:</strong> Importing will merge with existing data</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Data Management
          </CardTitle>
          <CardDescription>
            Manage your stored data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Current Data</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>{trades.length} trades stored</p>
                <p>{journalEntries.length} journal entries</p>
                <p>Data stored locally in browser</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Actions</h4>
              <Button
                variant="destructive"
                size="sm"
                onClick={clearAllData}
              >
                Clear All Data
              </Button>
            </div>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> Your data is stored locally in your browser.
              Regular backups are recommended to prevent data loss.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}