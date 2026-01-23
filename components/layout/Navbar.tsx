import React from 'react';
import { Menu, X, Bot, LayoutDashboard, FileCheck, Activity } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { ThemeToggle } from './ThemeToggle';
import { ViewMode } from '../../types';
import { RGLogo } from '../ui/RGLogo';

export const Navbar: React.FC = () => {
  const { isNavOpen, setNavOpen, currentView, setView, systemStatus } = useUIStore();

  const navItems: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
    { id: 'strategist', label: 'Strategist', icon: <Bot className="w-4 h-4" /> },
    { id: 'assessment', label: 'Assessment', icon: <FileCheck className="w-4 h-4" /> },
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  ];

  const getHealthColor = () => {
    switch(systemStatus) {
      case 'optimal': return 'bg-brand shadow-[0_0_8px_#002366]';
      case 'latent': return 'bg-yellow-500 shadow-[0_0_8px_#EAB308]';
      case 'disconnected': return 'bg-red-500 shadow-[0_0_8px_#EF4444] animate-pulse';
      default: return 'bg-brand';
    }
  };

  const getHealthText = () => {
    switch(systemStatus) {
      case 'optimal': return 'Systems Optimal';
      case 'latent': return 'Latency Detected';
      case 'disconnected': return 'Net_Link Offline';
      default: return 'Systems Optimal';
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b bg-white/70 dark:bg-dark-bg/70 border-light-border dark:border-dark-border transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex-shrink-0 flex items-center cursor-pointer group" 
            onClick={() => setView('strategist')}
          >
            <RGLogo showText size={32} />
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentView === item.id
                      ? 'bg-white dark:bg-dark-card text-brand shadow-sm'
                      : 'text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Actions & Health Monitor */}
          <div className="hidden md:flex items-center gap-6">
            {/* System Health Monitor */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-transparent hover:border-light-border dark:hover:border-dark-border transition-colors">
              <Activity className="w-3.5 h-3.5 text-light-muted dark:text-dark-muted" />
              <div className={`w-2 h-2 rounded-full ${getHealthColor()}`}></div>
              <span className="text-xs font-mono uppercase text-light-muted dark:text-dark-muted tracking-wide">
                {getHealthText()}
              </span>
            </div>
            
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-4">
             <div className={`w-2 h-2 rounded-full ${getHealthColor()}`}></div>
            <ThemeToggle />
            <button
              onClick={() => setNavOpen(!isNavOpen)}
              className="p-2 rounded-md text-light-muted dark:text-dark-muted hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              {isNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isNavOpen && (
        <div className="md:hidden border-t border-light-border dark:border-dark-border bg-white dark:bg-dark-bg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium ${
                  currentView === item.id
                    ? 'bg-brand/10 text-brand'
                    : 'text-light-muted dark:text-dark-muted hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};