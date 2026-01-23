
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
        <div className="bg-brand/10 p-2 rounded-lg" aria-hidden="true">
          <Bot className="w-6 h-6 text-brand" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-light-text tracking-tight">TEKGUYZ Strategist</h1>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500' : 'bg-green-500'} animate-pulse`} aria-hidden="true"></span>
            <span className="text-[10px] text-light-muted font-mono uppercase font-bold tracking-widest" aria-live="polite">
              {isLoading ? 'Pattern_Analysis' : 'Protocol_Live'}
            </span>
          </div>
        </div>
      </div>
      {qualificationScore > 0 && (
        <div 
          className="text-[10px] font-mono font-bold px-3 py-1 rounded bg-slate-100 border border-slate-200 text-brand"
          role="status"
          aria-label={`Current Lead Qualification Score: ${qualificationScore} out of 10`}
        >
          QUALIFICATION: {qualificationScore}/10
        </div>
      )}
    </header>
  );
};
