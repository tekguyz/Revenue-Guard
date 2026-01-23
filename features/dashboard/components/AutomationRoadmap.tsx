import React from 'react';

interface AutomationRoadmapProps {
  bottlenecks: string[];
}

export const AutomationRoadmap: React.FC<AutomationRoadmapProps> = ({ bottlenecks }) => {
  return (
    <div className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-light-border dark:border-dark-border shadow-sm flex flex-col relative overflow-hidden hover:border-brand/30 transition-colors">
      <h3 className="text-sm font-semibold uppercase text-light-muted dark:text-dark-muted mb-4 tracking-wider">Automation Roadmap</h3>
      <div className="flex-grow space-y-3" role="list">
        {bottlenecks.length > 0 ? bottlenecks.map((b, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-light-bg dark:bg-dark-bg rounded-lg border border-transparent hover:border-brand/20 transition-colors group/item" role="listitem">
            <div className="w-6 h-6 rounded-full bg-brand/10 dark:bg-brand-light/10 text-brand dark:text-brand-light flex items-center justify-center text-xs font-bold group-hover/item:bg-brand group-hover/item:text-white transition-colors">
              {i + 1}
            </div>
            <span className="text-sm font-medium text-light-text dark:text-dark-text">{b}</span>
          </div>
        )) : (
          <div className="text-sm text-light-muted dark:text-dark-muted italic">No specific bottlenecks identified yet.</div>
        )}
      </div>
      <div className="mt-4 pt-4 border-t border-light-border dark:border-dark-border">
        <div className="flex justify-between items-center text-xs">
          <span className="text-light-muted dark:text-dark-muted">Deployment Velocity:</span>
          <span className="font-bold text-brand dark:text-brand-light">4-8 Weeks</span>
        </div>
      </div>
    </div>
  );
};