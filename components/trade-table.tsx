"use client";

import { useState, useMemo } from 'react';
import { Trade } from '@/types/trade';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Search, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TradeTableProps {
  trades: Trade[];
  onEdit: (trade: Trade) => void;
  onDelete: (id: string) => void;
}

export default function TradeTable({ trades, onEdit, onDelete }: TradeTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredAndSortedTrades = useMemo(() => {
    const filtered = trades.filter(trade => {
      const matchesSearch = trade.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trade.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trade.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      switch (filterBy) {
        case 'wins':
          return matchesSearch && trade.pnl && trade.pnl > 0;
        case 'losses':
          return matchesSearch && trade.pnl && trade.pnl < 0;
        case 'open':
          return matchesSearch && trade.isOpen;
        case 'closed':
          return matchesSearch && !trade.isOpen;
        case 'long':
          return matchesSearch && trade.direction === 'long';
        case 'short':
          return matchesSearch && trade.direction === 'short';
        default:
          return matchesSearch;
      }
    });

    return filtered.sort((a, b) => {
      let aVal, bVal;

      switch (sortBy) {
        case 'symbol':
          aVal = a.symbol;
          bVal = b.symbol;
          break;
        case 'pnl':
          aVal = a.pnl || 0;
          bVal = b.pnl || 0;
          break;
        case 'date':
        default:
          aVal = new Date(a.entryDate).getTime();
          bVal = new Date(b.entryDate).getTime();
          break;
      }

      if (sortOrder === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });
  }, [trades, searchTerm, filterBy, sortBy, sortOrder]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Trade History
          <span className="text-sm font-normal text-muted-foreground">
            {filteredAndSortedTrades.length} trades
          </span>
        </CardTitle>

        {/* Filters and Search */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4" />
            <Input
              placeholder="Search trades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>

          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-32">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="wins">Wins</SelectItem>
              <SelectItem value="losses">Losses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="long">Long</SelectItem>
              <SelectItem value="short">Short</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="symbol">Symbol</SelectItem>
              <SelectItem value="pnl">P&L</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Direction</TableHead>
                <TableHead>Entry</TableHead>
                <TableHead>Exit</TableHead>
                <TableHead>Size/Lots</TableHead>
                <TableHead>P&L</TableHead>
                <TableHead>R:R</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedTrades.map((trade) => (
                <TableRow key={trade.id}>
                  <TableCell>{formatDate(trade.entryDate)}</TableCell>
                  <TableCell className="font-medium">{trade.symbol}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {trade.instrumentType?.toUpperCase() || 'STOCK'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={trade.direction === 'long' ? 'default' : 'secondary'}>
                      {trade.direction.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(trade.entryPrice)}</TableCell>
                  <TableCell>
                    {trade.exitPrice ? formatCurrency(trade.exitPrice) : '-'}
                  </TableCell>
                  <TableCell>
                    {trade.instrumentType === 'forex' || trade.instrumentType === 'commodity'
                      ? `${trade.lots || 0} lots`
                      : `${trade.size} shares`}
                  </TableCell>
                  <TableCell>
                    {trade.pnl !== null ? (
                      <span className={cn(
                        "font-medium",
                        trade.pnl > 0 ? "text-green-600" : "text-red-600"
                      )}>
                        {formatCurrency(trade.pnl)}
                      </span>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    {trade.riskRewardRatio ? (
                      <span className={cn(
                        "text-sm font-medium",
                        trade.riskRewardRatio >= 2 ? "text-green-600" :
                          trade.riskRewardRatio >= 1 ? "text-yellow-600" : "text-red-600"
                      )}>
                        1:{trade.riskRewardRatio.toFixed(2)}
                      </span>
                    ) : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={trade.isOpen ? 'destructive' : 'default'}>
                      {trade.isOpen ? 'Open' : 'Closed'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {trade.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {trade.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{trade.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(trade)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(trade.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredAndSortedTrades.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No trades found matching your criteria.
          </div>
        )}
      </CardContent>
    </Card>
  );
}