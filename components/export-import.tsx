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
        
        const trades: Trade[] = lines.slice(1)
          .filter(line => line.trim())
          .map((line, index) => {
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
            };
          });
        
        storage.saveTrades(trades);
        setImportStatus('success');
        setImportMessage(`Successfully imported ${trades.length} trades from CSV. Please refresh the page to see the changes.`);
        
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