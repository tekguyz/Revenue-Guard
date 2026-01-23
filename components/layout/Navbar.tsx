
import React from 'react';
import { Menu, X, Bot, LayoutDashboard, FileCheck } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
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
    <nav className="z-50 w-full glass-panel border-b bg-white/70 border-light-border transition-colors duration-300 flex-shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <div 
            className="flex-shrink-0 flex items-center cursor-pointer group" 
            onClick={() => setView('strategist')}
          >
            <RGLogo showText size={28} />
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-1 bg-black/5 p-1 rounded-xl">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    currentView === item.id
                      ? 'bg-white text-brand shadow-sm'
                      : 'text-light-muted hover:text-light-text'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Actions & Health Monitor */}
          <div className="hidden md:flex items-center gap-4">
            {/* System Health Monitor */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 border border-transparent hover:border-light-border transition-colors">
              <div className={`w-1.5 h-1.5 rounded-full ${getHealthColor()}`}></div>
              <span className="text-[9px] font-mono uppercase text-light-muted tracking-wide font-bold">
                {getHealthText()}
              </span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-4">
             <div className={`w-2 h-2 rounded-full ${getHealthColor()}`}></div>
            <button
              onClick={() => setNavOpen(!isNavOpen)}
              className="p-1.5 rounded-md text-light-muted hover:bg-black/5 transition-colors"
            >
              {isNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isNavOpen && (
        <div className="md:hidden border-t border-light-border bg-white absolute w-full shadow-2xl">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-md text-base font-bold ${
                  currentView === item.id
                    ? 'bg-brand/10 text-brand'
                    : 'text-light-muted hover:bg-black/5'
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
