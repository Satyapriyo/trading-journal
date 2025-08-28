"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { Trade } from '@/types/trade';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface TradeEditDialogProps {
  trade: Trade | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Trade>) => void;
}

export default function TradeEditDialog({ trade, isOpen, onClose, onUpdate }: TradeEditDialogProps) {
  const [formData, setFormData] = useState({
    symbol: trade?.symbol || '',
    instrumentType: trade?.instrumentType || 'stock' as 'stock' | 'forex' | 'commodity' | 'crypto',
    entryPrice: trade?.entryPrice || 0,
    exitPrice: trade?.exitPrice || null,
    size: trade?.size || 0,
    lots: trade?.lots || 0,
    lotSize: trade?.lotSize || 100000,
    pipValue: trade?.pipValue || 10,
    tickSize: trade?.tickSize || 0.25,
    tickValue: trade?.tickValue || 50,
    direction: trade?.direction || 'long' as 'long' | 'short',
    entryDate: trade?.entryDate ? new Date(trade.entryDate).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
    exitDate: trade?.exitDate ? new Date(trade.exitDate).toISOString().slice(0, 16) : '',
    notes: trade?.notes || '',
    tags: trade?.tags || [],
    screenshots: trade?.screenshots || [],
    commission: trade?.commission || 0,
    setup: trade?.setup || '',
    risk: trade?.risk || 0,
    reward: trade?.reward || 0,
    isOpen: trade?.isOpen ?? true
  });

  const [newTag, setNewTag] = useState('');
  
  // Calculate risk-to-reward ratio
  const riskRewardRatio = formData.risk > 0 ? formData.reward / formData.risk : 0;

  // Update form data when trade changes
  useState(() => {
    if (trade) {
      setFormData({
        symbol: trade.symbol,
        instrumentType: trade.instrumentType || 'stock',
        entryPrice: trade.entryPrice,
        exitPrice: trade.exitPrice,
        size: trade.size,
        lots: trade.lots || 0,
        lotSize: trade.lotSize || 100000,
        pipValue: trade.pipValue || 10,
        tickSize: trade.tickSize || 0.25,
        tickValue: trade.tickValue || 50,
        direction: trade.direction,
        entryDate: new Date(trade.entryDate).toISOString().slice(0, 16),
        exitDate: trade.exitDate ? new Date(trade.exitDate).toISOString().slice(0, 16) : '',
        notes: trade.notes,
        tags: [...trade.tags],
        screenshots: [...trade.screenshots],
        commission: trade.commission,
        setup: trade.setup,
        risk: trade.risk,
        reward: trade.reward,
        isOpen: trade.isOpen
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trade) return;

    onUpdate(trade.id, {
      ...formData,
      riskRewardRatio: riskRewardRatio,
      exitPrice: formData.isOpen ? null : formData.exitPrice,
      exitDate: formData.isOpen ? null : formData.exitDate || null,
    });
    
    onClose();
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ 
      ...prev, 
      tags: prev.tags.filter(tag => tag !== tagToRemove) 
    }));
  };

  if (!trade) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Trade</DialogTitle>
          <DialogDescription>
            Update your trade details
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="symbol">Symbol</Label>
              <Input
                id="symbol"
                value={formData.symbol}
                onChange={(e) => setFormData(prev => ({ ...prev, symbol: e.target.value }))}
                placeholder="EURUSD, XAUUSD, AAPL"
                required
              />
            </div>
            <div>
              <Label htmlFor="instrumentType">Instrument Type</Label>
              <Select 
                value={formData.instrumentType} 
                onValueChange={(value: 'stock' | 'forex' | 'commodity' | 'crypto') => 
                  setFormData(prev => ({ ...prev, instrumentType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stock">Stock</SelectItem>
                  <SelectItem value="forex">Forex</SelectItem>
                  <SelectItem value="commodity">Commodity</SelectItem>
                  <SelectItem value="crypto">Crypto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="direction">Direction</Label>
              <Select 
                value={formData.direction} 
                onValueChange={(value: 'long' | 'short') => 
                  setFormData(prev => ({ ...prev, direction: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="long">Long</SelectItem>
                  <SelectItem value="short">Short</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="entryPrice">Entry Price</Label>
              <Input
                id="entryPrice"
                type="number"
                step="0.00001"
                value={formData.entryPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, entryPrice: parseFloat(e.target.value) }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="commission">Commission</Label>
              <Input
                id="commission"
                type="number"
                step="0.01"
                value={formData.commission}
                onChange={(e) => setFormData(prev => ({ ...prev, commission: parseFloat(e.target.value) }))}
              />
            </div>
          </div>

          {/* Size/Lots based on instrument type */}
          {formData.instrumentType === 'forex' ? (
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="lots">Lots</Label>
                <Input
                  id="lots"
                  type="number"
                  step="0.01"
                  value={formData.lots}
                  onChange={(e) => setFormData(prev => ({ ...prev, lots: parseFloat(e.target.value) }))}
                  placeholder="1.0"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lotSize">Lot Size</Label>
                <Input
                  id="lotSize"
                  type="number"
                  value={formData.lotSize}
                  onChange={(e) => setFormData(prev => ({ ...prev, lotSize: parseInt(e.target.value) }))}
                  placeholder="100000"
                />
              </div>
              <div>
                <Label htmlFor="pipValue">Pip Value ($)</Label>
                <Input
                  id="pipValue"
                  type="number"
                  step="0.01"
                  value={formData.pipValue}
                  onChange={(e) => setFormData(prev => ({ ...prev, pipValue: parseFloat(e.target.value) }))}
                  placeholder="10"
                />
              </div>
            </div>
          ) : formData.instrumentType === 'commodity' ? (
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label htmlFor="lots">Contracts</Label>
                <Input
                  id="lots"
                  type="number"
                  step="1"
                  value={formData.lots}
                  onChange={(e) => setFormData(prev => ({ ...prev, lots: parseInt(e.target.value) }))}
                  placeholder="1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="tickSize">Tick Size</Label>
                <Input
                  id="tickSize"
                  type="number"
                  step="0.001"
                  value={formData.tickSize}
                  onChange={(e) => setFormData(prev => ({ ...prev, tickSize: parseFloat(e.target.value) }))}
                  placeholder="0.25"
                />
              </div>
              <div>
                <Label htmlFor="tickValue">Tick Value ($)</Label>
                <Input
                  id="tickValue"
                  type="number"
                  step="0.01"
                  value={formData.tickValue}
                  onChange={(e) => setFormData(prev => ({ ...prev, tickValue: parseFloat(e.target.value) }))}
                  placeholder="50"
                />
              </div>
            </div>
          ) : (
            <div>
              <Label htmlFor="size">Size</Label>
              <Input
                id="size"
                type="number"
                value={formData.size}
                onChange={(e) => setFormData(prev => ({ ...prev, size: parseInt(e.target.value) }))}
                placeholder="Shares/Units"
                required
              />
            </div>
          )}

          <div>
            <Label htmlFor="entryDate">Entry Date & Time</Label>
            <Input
              id="entryDate"
              type="datetime-local"
              value={formData.entryDate}
              onChange={(e) => setFormData(prev => ({ ...prev, entryDate: e.target.value }))}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isOpen"
              checked={!formData.isOpen}
              onChange={(e) => setFormData(prev => ({ ...prev, isOpen: !e.target.checked }))}
            />
            <Label htmlFor="isOpen">Trade is closed</Label>
          </div>

          {!formData.isOpen && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="exitPrice">Exit Price</Label>
                <Input
                  id="exitPrice"
                  type="number"
                  step="0.01"
                  value={formData.exitPrice || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, exitPrice: parseFloat(e.target.value) }))}
                  required={!formData.isOpen}
                />
              </div>
              <div>
                <Label htmlFor="exitDate">Exit Date & Time</Label>
                <Input
                  id="exitDate"
                  type="datetime-local"
                  value={formData.exitDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, exitDate: e.target.value }))}
                  required={!formData.isOpen}
                />
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="setup">Setup Type</Label>
            <Input
              id="setup"
              value={formData.setup}
              onChange={(e) => setFormData(prev => ({ ...prev, setup: e.target.value }))}
              placeholder="Breakout, Pullback, Reversal, etc."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="risk">Risk ($)</Label>
              <Input
                id="risk"
                type="number"
                step="0.01"
                value={formData.risk}
                onChange={(e) => setFormData(prev => ({ ...prev, risk: parseFloat(e.target.value) }))}
                placeholder="Amount you're willing to lose"
              />
            </div>
            <div>
              <Label htmlFor="reward">Target Reward ($)</Label>
              <Input
                id="reward"
                type="number"
                step="0.01"
                value={formData.reward}
                onChange={(e) => setFormData(prev => ({ ...prev, reward: parseFloat(e.target.value) }))}
                placeholder="Expected profit target"
              />
            </div>
          </div>

          {/* Risk-Reward Ratio Display */}
          {formData.risk > 0 && formData.reward > 0 && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900">Risk-to-Reward Ratio:</span>
                <span className={`text-lg font-bold ${riskRewardRatio >= 2 ? 'text-green-600' : riskRewardRatio >= 1 ? 'text-yellow-600' : 'text-red-600'}`}>
                  1:{riskRewardRatio.toFixed(2)}
                </span>
              </div>
              <div className="text-xs text-blue-700 mt-1">
                {riskRewardRatio >= 2 ? 'Excellent risk management!' : 
                 riskRewardRatio >= 1 ? 'Good risk-reward ratio' : 
                 'Consider improving your risk-reward ratio'}
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Trade notes, psychology, mistakes, etc."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Update Trade
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}