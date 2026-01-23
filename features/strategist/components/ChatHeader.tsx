import React from 'react';
import { Bot } from 'lucide-react';

interface ChatHeaderProps {
  isLoading: boolean;
  qualificationScore: number;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ isLoading, qualificationScore }) => {
  return (
    <header className="flex items-center justify-between mb-4 flex-shrink-0 px-2" aria-label="Strategist Status">
      <div className="flex items-center gap-3">
        <div className="bg-brand/10 dark:bg-brand-light/10 p-2 rounded-lg" aria-hidden="true">
          <Bot className="w-6 h-6 text-brand dark:text-brand-light" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-light-text dark:text-dark-text">TEKGUYZ Strategist</h1>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400' : 'bg-green-500'} animate-pulse`} aria-hidden="true"></span>
            <span className="text-xs text-light-muted dark:text-dark-muted font-mono uppercase" aria-live="polite">
              {isLoading ? 'Analyzing Pattern...' : 'System Online'}
            </span>
          </div>
        </div>
      </div>
      {qualificationScore > 0 && (
        <div 
          className="text-xs font-mono px-3 py-1 rounded border border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted"
          role="status"
          aria-label={`Current Lead Qualification Score: ${qualificationScore} out of 10`}
        >
          QUALIFICATION: {qualificationScore}/10
        </div>
      )}
    </header>
  );
};