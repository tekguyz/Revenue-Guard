import React from 'react';
import { ROICounter } from '../../../components/ui/ROICounter';

interface StepMultiplierProps {
  staffCount: number;
  hoursWasted: number;
  calculatedROI: number;
  setStaffCount: (val: number) => void;
  setHoursWasted: (val: number) => void;
}

export const StepMultiplier: React.FC<StepMultiplierProps> = ({ 
  staffCount, 
  hoursWasted, 
  calculatedROI, 
  setStaffCount, 
  setHoursWasted 
}) => {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">The Multiplier</h2>
        <p className="text-light-muted dark:text-dark-muted">Calculate the potential impact of automation across your team.</p>
      </header>
      
      <div className="grid gap-6">
        <div>
          <label htmlFor="staffCount" className="block text-sm font-medium mb-2 text-light-text dark:text-dark-text">Current Staff Count</label>
          <input 
            id="staffCount"
            type="number" 
            className="w-full p-3 rounded-xl bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border focus:ring-2 focus:ring-brand text-light-text dark:text-dark-text text-base"
            value={staffCount || ''}
            onChange={(e) => setStaffCount(parseInt(e.target.value) || 0)}
          />
        </div>
        <div>
          <label htmlFor="hoursWasted" className="block text-sm font-medium mb-2 text-light-text dark:text-dark-text">Hours Wasted Per Week (Avg)</label>
          <input 
            id="hoursWasted"
            type="number" 
            className="w-full p-3 rounded-xl bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border focus:ring-2 focus:ring-brand text-light-text dark:text-dark-text text-base"
            value={hoursWasted || ''}
            onChange={(e) => setHoursWasted(parseInt(e.target.value) || 0)}
          />
        </div>
      </div>

      {/* Live ROI Counter */}
      <div className="mt-8 p-6 bg-accent/5 dark:bg-accent-light/10 rounded-2xl border border-accent/20 dark:border-accent-light/20 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent dark:via-accent-light to-transparent opacity-50"></div>
        <p className="text-sm uppercase tracking-wide text-accent dark:text-accent-light font-bold mb-1">Projected Annual Savings</p>
        <div className="py-2">
          <ROICounter value={calculatedROI} />
        </div>
        <p className="text-xs text-light-muted dark:text-dark-muted mt-2 opacity-70">*Based on TEKGUYZ efficiency models</p>
      </div>
    </div>
  );
};