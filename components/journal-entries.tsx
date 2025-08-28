"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { JournalEntry } from '@/types/trade';
import { Plus, Edit, Trash2, Calendar, Smile, Meh, Frown } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface JournalEntriesProps {
  entries: JournalEntry[];
  onAdd: (entry: Omit<JournalEntry, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<JournalEntry>) => void;
  onDelete: (id: string) => void;
}

export default function JournalEntries({ entries, onAdd, onUpdate, onDelete }: JournalEntriesProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    date: new Date().toISOString().slice(0, 10),
    mood: 'neutral' as JournalEntry['mood'],
    tags: [] as string[]
  });
  const [newTag, setNewTag] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingEntry) {
      onUpdate(editingEntry.id, formData);
    } else {
      onAdd(formData);
    }
    
    resetForm();
    setIsDialogOpen(false);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      date: new Date().toISOString().slice(0, 10),
      mood: 'neutral',
      tags: []
    });
    setEditingEntry(null);
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

  const startEditing = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setFormData({
      title: entry.title,
      content: entry.content,
      date: entry.date,
      mood: entry.mood,
      tags: [...entry.tags]
    });
    setIsDialogOpen(true);
  };

  const getMoodIcon = (mood: JournalEntry['mood']) => {
    switch (mood) {
      case 'excellent':
      case 'good':
        return <Smile className="h-4 w-4 text-green-500" />;
      case 'neutral':
        return <Meh className="h-4 w-4 text-yellow-500" />;
      case 'bad':
      case 'terrible':
        return <Frown className="h-4 w-4 text-red-500" />;
      default:
        return <Meh className="h-4 w-4 text-gray-500" />;
    }
  };

  const getMoodColor = (mood: JournalEntry['mood']) => {
    switch (mood) {
      case 'excellent':
        return 'bg-green-100 text-green-800';
      case 'good':
        return 'bg-green-50 text-green-700';
      case 'neutral':
        return 'bg-yellow-100 text-yellow-800';
      case 'bad':
        return 'bg-red-50 text-red-700';
      case 'terrible':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Trading Journal</h2>
          <p className="text-muted-foreground">Track your thoughts, reflections, and market observations</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              New Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingEntry ? 'Edit Journal Entry' : 'New Journal Entry'}</DialogTitle>
              <DialogDescription>
                Record your thoughts, emotions, and observations about your trading
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Entry title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="mood">Mood</Label>
                <Select 
                  value={formData.mood} 
                  onValueChange={(value: JournalEntry['mood']) => 
                    setFormData(prev => ({ ...prev, mood: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="bad">Bad</SelectItem>
                    <SelectItem value="terrible">Terrible</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="What happened today? How are you feeling about your trades? Any lessons learned?"
                  rows={6}
                  required
                />
              </div>

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
                      <button 
                        type="button"
                        className="ml-1 text-xs"
                        onClick={() => removeTag(tag)}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingEntry ? 'Update' : 'Add'} Entry
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {entries.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No journal entries yet</h3>
              <p className="text-muted-foreground mb-4">
                Start documenting your trading journey and reflections
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create your first entry
              </Button>
            </CardContent>
          </Card>
        ) : (
          entries
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map(entry => (
              <Card key={entry.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{entry.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(entry.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getMoodColor(entry.mood)}>
                        {getMoodIcon(entry.mood)}
                        <span className="ml-1 capitalize">{entry.mood}</span>
                      </Badge>
                      <Button variant="ghost" size="sm" onClick={() => startEditing(entry)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onDelete(entry.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap mb-3">{entry.content}</p>
                  {entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {entry.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
        )}
      </div>
    </div>
  );
}