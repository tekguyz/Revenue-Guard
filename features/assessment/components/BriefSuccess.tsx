import React from 'react';
import { Check, LayoutDashboard } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { ROICounter } from '../../../components/ui/ROICounter';

interface BriefSuccessProps {
  calculatedROI: number;
  email: string;
  onViewDashboard: () => void;
}

export const BriefSuccess: React.FC<BriefSuccessProps> = ({ calculatedROI, email, onViewDashboard }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-brand/5 dark:bg-brand-light/5 border border-brand/20 rounded-2xl text-center animate-in fade-in zoom-in duration-500">
      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-500/30">
        <Check className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-2xl font-bold mb-2 text-light-text dark:text-dark-text">Phase 1: Sprint Requested</h2>
      <p className="text-light-muted dark:text-dark-muted mb-6">
        Our strategists are analyzing your data.
      </p>
      <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-brand/30 shadow-xl mb-8 w-full max-w-sm">
        <p className="text-sm text-light-muted dark:text-dark-muted uppercase tracking-wider font-semibold mb-2">Estimated Potential Savings</p>
        <ROICounter value={calculatedROI} />
      </div>
      <Button onClick={onViewDashboard} aria-label="Open Command Center">
        <LayoutDashboard className="w-4 h-4 mr-2" />
        View Command Center
      </Button>
    </div>
  );
};