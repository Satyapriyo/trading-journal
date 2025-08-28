"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  TrendingUp, 
  BarChart3, 
  BookOpen, 
  Settings, 
  Plus, 
  DollarSign,
  Calendar,
  PieChart,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddTrade: () => void;
}

const navigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: TrendingUp,
    description: 'Overview & Calendar'
  },
  {
    id: 'trades',
    label: 'Trades',
    icon: BarChart3,
    description: 'Trade History'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: PieChart,
    description: 'Charts & Analysis'
  },
  {
    id: 'journal',
    label: 'Journal',
    icon: BookOpen,
    description: 'Notes & Reflections'
  },
  {
    id: 'performance',
    label: 'Performance',
    icon: TrendingUp,
    description: 'Metrics & Stats'
  },
  {
    id: 'settings',
    label: 'Export/Import',
    icon: Settings,
    description: 'Data Management'
  }
];

export default function Sidebar({ activeTab, onTabChange, onAddTrade }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 z-50 h-full bg-white border-r border-slate-200 transition-all duration-300 flex flex-col",
        isCollapsed ? "w-16" : "w-64"
      )}>
        {/* Header */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900">Trading Journal</h1>
                  <p className="text-xs text-slate-600">Track & Analyze</p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="lg:hidden"
            >
              {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Add Trade Button */}
        <div className="p-4">
          <Button 
            onClick={onAddTrade}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            size={isCollapsed ? "sm" : "default"}
          >
            <Plus className="h-4 w-4" />
            {!isCollapsed && <span className="ml-2">Add Trade</span>}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 pb-4">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start transition-all duration-200",
                    isActive && "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200",
                    !isActive && "hover:bg-slate-50",
                    isCollapsed && "px-2"
                  )}
                  onClick={() => onTabChange(item.id)}
                >
                  <Icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                  {!isCollapsed && (
                    <div className="text-left">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-muted-foreground">{item.description}</div>
                    </div>
                  )}
                </Button>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-slate-200">
            <div className="text-xs text-slate-500 text-center">
              <p>© 2025 Trading Journal</p>
              <p>Built with Next.js & shadcn/ui</p>
            </div>
          </div>
        )}
      </div>

      {/* Mobile toggle button */}
      <Button
        variant="outline"
        size="sm"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <Menu className="h-4 w-4" />
      </Button>
    </>
  );
}