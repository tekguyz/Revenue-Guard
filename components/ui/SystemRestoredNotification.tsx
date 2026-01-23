import React, { useEffect, useRef } from 'react';
import { Database } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

export const SystemRestoredNotification: React.FC = () => {
  const { hasRestoredSession, setHasRestoredSession } = useUIStore();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hasRestoredSession) {
      const timer = setTimeout(() => {
        if (ref.current) {
          ref.current.animate([
            { opacity: 1, transform: 'translateY(0)' },
            { opacity: 0, transform: 'translateY(-20px)' }
          ], {
            duration: 500,
            fill: 'forwards',
            easing: 'ease-in'
          }).finished.then(() => {
             setHasRestoredSession(false);
          });
        }
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [hasRestoredSession, setHasRestoredSession]);

  if (!hasRestoredSession) return null;

  return (
    <div 
        ref={ref}
        className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 fade-in duration-500"
    >
      <div className="bg-brand/10 backdrop-blur-md border border-brand/50 text-brand px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
        <Database className="w-4 h-4 animate-pulse" />
        <span className="text-sm font-mono font-medium">SESSION_DATA RESTORED</span>
      </div>
    </div>
  );
};