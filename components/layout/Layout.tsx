
import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="fixed inset-0 flex flex-col bg-light-bg text-light-text overflow-hidden antialiased">
      <Navbar />
      <main className="flex-grow min-h-0 relative container mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
        {children}
      </main>
      <Footer />
    </div>
  );
};
