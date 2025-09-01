"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ThemeToggle, ThemeToggleCollapsed } from '@/components/theme-toggle';
import {
  TrendingUp,
  BarChart3,
  BookOpen,
  Settings,
  Plus,
  // DollarSign, // Removed unused import
  // Calendar, // Removed unused import
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
  const [isCollapsed, setIsCollapsed] = useState(true); // Start collapsed on mobile

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 z-50 h-full bg-white dark:bg-gray-900 border-r border-blue-200 dark:border-gray-700 transition-all duration-300 flex flex-col lg:translate-x-0",
        isCollapsed ? "-translate-x-full lg:w-16" : "translate-x-0 w-64"
      )}>
        {/* Header */}
        <div className="p-4 border-b border-blue-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-500 dark:to-black rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white">Trading Journal</h1>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Track & Analyze</p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="lg:hidden cursor-pointer"
            >
              {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Add Trade Button */}
        <div className="p-4">
          <Button
            onClick={onAddTrade}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-600 dark:to-black hover:from-blue-700 hover:to-blue-900 dark:hover:from-blue-700 dark:hover:to-gray-900 cursor-pointer"
            size={isCollapsed ? "sm" : "default"}
          >
            <Plus className="h-4 w-4" />
            {!isCollapsed && <span className="ml-2">Add Trade</span>}
          </Button>
        </div>

        {/* Theme Toggle */}
        <div className="px-4 pb-4">
          {isCollapsed ? <ThemeToggleCollapsed /> : <ThemeToggle />}
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
                    "w-full justify-start transition-all duration-200 cursor-pointer",
                    isActive && "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-black text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-gray-600",
                    !isActive && "hover:bg-blue-50 dark:hover:bg-gray-800",
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
          <div className="p-4 border-t border-blue-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
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
        className="fixed top-4 left-4 z-50 lg:hidden cursor-pointer bg-white dark:bg-gray-900 border-blue-200 dark:border-gray-700 shadow-lg"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <Menu className="h-4 w-4" />
      </Button>
    </>
  );
}