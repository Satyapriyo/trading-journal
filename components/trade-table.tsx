"use client";

import { useState, useMemo } from 'react';
import { Trade } from '@/types/trade';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Edit, Trash2, Search, Filter, AlertTriangle } from 'lucide-react';
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
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [tradeToDelete, setTradeToDelete] = useState<Trade | null>(null);

  const handleDeleteClick = (trade: Trade) => {
    setTradeToDelete(trade);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (tradeToDelete) {
      onDelete(tradeToDelete.id);
      setDeleteConfirmOpen(false);
      setTradeToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setTradeToDelete(null);
  };

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
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span>Trade History</span>
            <span className="text-sm font-normal text-muted-foreground">
              {filteredAndSortedTrades.length} trades
            </span>
          </CardTitle>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4" />
              <Input
                placeholder="Search trades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 sm:w-64"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-full sm:w-32">
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
                <SelectTrigger className="w-full sm:w-32">
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
                className="cursor-pointer"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
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
                          className="cursor-pointer hover:bg-gray-100"
                          onClick={() => onEdit(trade)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="cursor-pointer hover:bg-gray-100"
                          onClick={() => handleDeleteClick(trade)}
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

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {filteredAndSortedTrades.map((trade) => {
              const riskRewardRatio = trade.risk && trade.risk > 0 ? (trade.reward || 0) / trade.risk : null;

              return (
                <Card key={trade.id} className="border-l-4" style={{
                  borderLeftColor: (trade.pnl || 0) > 0 ? '#10b981' : (trade.pnl || 0) < 0 ? '#ef4444' : '#6b7280'
                }}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">{trade.symbol}</span>
                          <Badge variant="outline" className="text-xs">
                            {trade.instrumentType?.toUpperCase() || 'STOCK'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 h-8 w-8 p-0"
                            onClick={() => onEdit(trade)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-800 h-8 w-8 p-0"
                            onClick={() => handleDeleteClick(trade)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* P&L and Status */}
                      <div className="flex items-center justify-between">
                        <span className={cn(
                          "text-lg font-bold",
                          (trade.pnl || 0) > 0 ? "text-green-600 dark:text-green-400" :
                            (trade.pnl || 0) < 0 ? "text-red-600 dark:text-red-400" : "text-gray-600"
                        )}>
                          {formatCurrency(trade.pnl || 0)}
                        </span>
                        <Badge variant={trade.isOpen ? "secondary" : "default"}>
                          {trade.isOpen ? "OPEN" : "CLOSED"}
                        </Badge>
                      </div>

                      {/* Direction and Size */}
                      <div className="flex items-center justify-between">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            trade.direction === 'long' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400' :
                              'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400'
                          )}
                        >
                          {trade.direction.toUpperCase()}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {trade.instrumentType === 'forex' ?
                            `${trade.lots} lots` :
                            `${trade.size} shares`
                          }
                        </span>
                      </div>

                      {/* Price Details */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Entry</div>
                          <div className="font-medium">${trade.entryPrice}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Exit</div>
                          <div className="font-medium">
                            {trade.exitPrice ? `$${trade.exitPrice}` : '-'}
                          </div>
                        </div>
                      </div>

                      {/* Date and R:R */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Date</div>
                          <div className="font-medium">{formatDate(trade.entryDate)}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">R:R</div>
                          <div className="font-medium">
                            {riskRewardRatio ? `1:${riskRewardRatio.toFixed(1)}` : '-'}
                          </div>
                        </div>
                      </div>

                      {/* Tags */}
                      {trade.tags && trade.tags.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {trade.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400">
                              {tag}
                            </Badge>
                          ))}
                          {trade.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{trade.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredAndSortedTrades.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No trades found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Confirm Delete
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this trade? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {tradeToDelete && (
            <div className="py-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Symbol:</span>
                  <span>{tradeToDelete.symbol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Direction:</span>
                  <Badge variant={tradeToDelete.direction === 'long' ? 'default' : 'secondary'}>
                    {tradeToDelete.direction.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Entry Price:</span>
                  <span>${tradeToDelete.entryPrice.toFixed(4)}</span>
                </div>
                {tradeToDelete.pnl !== null && (
                  <div className="flex justify-between">
                    <span className="font-medium">P&L:</span>
                    <span className={cn(
                      "font-semibold",
                      tradeToDelete.pnl >= 0 ? "text-green-600" : "text-red-600"
                    )}>
                      ${tradeToDelete.pnl.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" className="cursor-pointer" onClick={handleCancelDelete}>
              Cancel
            </Button>
            <Button variant="destructive" className="cursor-pointer" onClick={handleConfirmDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Trade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}