
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-2 border-t border-light-border bg-white flex-shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center gap-4">
        <div className="text-[9px] font-mono uppercase tracking-widest text-light-muted flex items-center gap-3">
          <span className="opacity-70 font-bold">© {new Date().getFullYear()} Revenue Guard</span>
          <a 
            href="https://tekguyz.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-brand hover:text-accent transition-colors font-black flex items-center gap-1 group"
          >
            MADE BY <span className="group-hover:underline">TEKGUYZ</span>
          </a>
        </div>
        <div className="flex gap-4 text-[9px] font-mono uppercase tracking-widest text-light-muted">
          <a href="#" className="hover:text-brand transition-colors font-bold opacity-70 hover:opacity-100">Privacy_Protocol</a>
          <a href="#" className="hover:text-brand transition-colors font-bold opacity-70 hover:opacity-100">Terms_of_Service</a>
        </div>
      </div>
    </footer>
  );
};
