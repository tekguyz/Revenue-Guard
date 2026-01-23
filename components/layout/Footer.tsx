import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 border-t border-light-border dark:border-dark-border bg-white dark:bg-dark-bg transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm text-light-muted dark:text-dark-muted">
          © {new Date().getFullYear()} Revenue Guard. All rights reserved.
        </div>
        <div className="flex gap-6 text-sm font-medium text-light-muted dark:text-dark-muted">
          <a href="#" className="hover:text-brand transition-colors">Privacy</a>
          <a href="#" className="hover:text-brand transition-colors">Terms</a>
          <a href="#" className="hover:text-brand transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
};