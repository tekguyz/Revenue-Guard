import React, { useRef, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useUIStore();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (indicatorRef.current) {
      const isDark = theme === 'dark';
      indicatorRef.current.animate([
        { transform: isDark ? 'translateX(0px)' : 'translateX(28px)' }
      ], {
        duration: 300,
        easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Physics-based spring
        fill: 'forwards'
      });
    }
  }, [theme]);

  return (
    <button
      ref={toggleRef}
      onClick={toggleTheme}
      className="relative w-16 h-8 rounded-full bg-light-border dark:bg-dark-border p-1 shadow-inner transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-accent"
      aria-label="Toggle Theme"
    >
      {/* Background Icons */}
      <div className="absolute inset-0 flex items-center justify-between px-2 text-xs">
         <Sun className="w-3 h-3 text-yellow-500 opacity-80" />
         <Moon className="w-3 h-3 text-indigo-400 opacity-80" />
      </div>

      {/* Sliding Indicator */}
      <div 
        ref={indicatorRef}
        className="absolute top-1 left-1 w-6 h-6 bg-white dark:bg-gray-800 rounded-full shadow-md z-10 flex items-center justify-center transform"
      >
      </div>
    </button>
  );
};