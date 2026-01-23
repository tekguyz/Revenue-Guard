import React from 'react';
import { useUIStore } from '../../store/uiStore';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme } = useUIStore();

  return (
    <div className={`${theme} fixed inset-0 flex flex-col bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text transition-colors duration-300 overflow-hidden`}>
      <Navbar />
      <main className="flex-grow min-h-0 relative container mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
        {children}
      </main>
      <Footer />
    </div>
  );
};