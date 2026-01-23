import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-2 border-t border-light-border dark:border-dark-border bg-white dark:bg-dark-bg transition-colors duration-300 flex-shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center gap-4">
        <div className="text-[9px] font-mono uppercase tracking-widest text-light-muted dark:text-dark-muted flex items-center gap-3">
          <span className="opacity-50">© {new Date().getFullYear()} Revenue Guard</span>
          <a 
            href="https://tekguyz.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-brand transition-colors font-bold flex items-center gap-1 group"
          >
            MADE BY <span className="text-accent group-hover:underline">TEKGUYZ</span>
          </a>
        </div>
        <div className="flex gap-4 text-[9px] font-mono uppercase tracking-widest text-light-muted dark:text-dark-muted">
          <a href="#" className="hover:text-brand transition-colors opacity-50 hover:opacity-100">Privacy</a>
          <a href="#" className="hover:text-brand transition-colors opacity-50 hover:opacity-100">Terms</a>
        </div>
      </div>
    </footer>
  );
};