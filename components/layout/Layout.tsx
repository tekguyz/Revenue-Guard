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
    <div className={`${theme} h-screen flex flex-col overflow-hidden`}>
      <div className="flex-grow flex flex-col bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text transition-colors duration-300">
        <Navbar />
        <main className="flex-grow overflow-hidden relative container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};