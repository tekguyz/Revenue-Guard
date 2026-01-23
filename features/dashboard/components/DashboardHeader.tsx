import React from 'react';
import { LayoutDashboard, ShieldCheck } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

interface DashboardHeaderProps {
  onSecureSprint: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onSecureSprint }) => {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-light-border dark:border-dark-border pb-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <LayoutDashboard className="w-6 h-6 text-brand dark:text-brand-light" />
          <h1 className="text-2xl font-bold tracking-tight text-light-text dark:text-dark-text">ROI COMMAND CENTER</h1>
        </div>
        <div className="flex items-center gap-2 text-sm font-mono">
          <span className="w-2 h-2 rounded-full bg-brand dark:bg-brand-light animate-[glow-pulse_2s_infinite]" aria-hidden="true"></span>
          <span className="text-brand dark:text-brand-light font-bold">STRATEGIC AUDIT COMPLETE</span>
          <span className="text-light-muted dark:text-dark-muted" aria-hidden="true">//</span>
          <span className="text-light-muted dark:text-dark-muted">PHASE 1 PRE-BRIEF</span>
        </div>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" size="sm" aria-label="Download Report PDF">Download PDF</Button>
        <Button onClick={onSecureSprint} icon={<ShieldCheck className="w-4 h-4"/>} aria-label="Secure My Sprint">
          Secure My Sprint
        </Button>
      </div>
    </header>
  );
};