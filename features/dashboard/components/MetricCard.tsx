import React from 'react';

interface MetricCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  gradient?: string;
  borderColorClass?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  description, 
  children, 
  gradient,
  borderColorClass = 'hover:border-brand/30'
}) => {
  return (
    <article className={`bg-white dark:bg-dark-card p-6 rounded-2xl border border-light-border dark:border-dark-border shadow-sm flex flex-col items-center justify-center relative overflow-hidden group transition-colors ${borderColorClass}`}>
      {gradient && <div className={`absolute top-0 w-full h-1 ${gradient}`}></div>}
      <h3 className="text-sm font-semibold uppercase text-light-muted dark:text-dark-muted mb-4 tracking-wider">{title}</h3>
      {children}
      <p className="mt-4 text-xs text-center text-light-muted dark:text-dark-muted px-4">
        {description}
      </p>
    </article>
  );
};