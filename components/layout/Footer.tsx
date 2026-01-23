import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-4 border-t border-light-border dark:border-dark-border bg-white dark:bg-dark-bg transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-[10px] font-mono uppercase tracking-widest text-light-muted dark:text-dark-muted flex items-center gap-4">
          <span>© {new Date().getFullYear()} Revenue Guard</span>
          <span className="hidden md:inline opacity-30">|</span>
          <a 
            href="https://tekguyz.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-brand transition-colors font-bold flex items-center gap-1"
          >
            MADE BY <span className="text-accent">TEKGUYZ</span>
          </a>
        </div>
        <div className="flex gap-6 text-[10px] font-mono uppercase tracking-widest text-light-muted dark:text-dark-muted">
          <a href="#" className="hover:text-brand transition-colors">Privacy_Protocol</a>
          <a href="#" className="hover:text-brand transition-colors">Terms_of_Service</a>
        </div>
      </div>
    </footer>
  );
};