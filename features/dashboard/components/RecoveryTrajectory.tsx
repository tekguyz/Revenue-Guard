
import React from 'react';
import { TimeRecoveryChart } from '../../../components/ui/TimeRecoveryChart';
import { useLeadStore } from '../../../store/leadStore';

interface RecoveryTrajectoryProps {
  monthlySavings: number;
}

export const RecoveryTrajectory: React.FC<RecoveryTrajectoryProps> = ({ monthlySavings }) => {
  const { brief } = useLeadStore();
  
  return (
    <section className="bg-white dark:bg-dark-card rounded-2xl border border-light-border dark:border-dark-border shadow-lg p-8 relative overflow-hidden" aria-label="Recovery Trajectory Chart">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h3 className="text-lg font-bold text-light-text dark:text-dark-text">12-Month Time Recovery Trajectory</h3>
          <p className="text-sm text-light-muted dark:text-dark-muted">Cumulative value generated post-deployment.</p>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-light-border dark:bg-dark-border"></div>
            <span className="text-light-muted dark:text-dark-muted">Baseline</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent dark:bg-accent-light"></div>
            <span className="font-medium text-accent dark:text-accent-light">Phase 1 Impact</span>
          </div>
        </div>
      </div>
      
      <div className="h-64 w-full" aria-hidden="true">
        <TimeRecoveryChart monthlySavings={monthlySavings} />
      </div>
      
      {/* Benchmarks */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-light-border dark:border-dark-border">
        <div>
          <div className="text-xs text-light-muted dark:text-dark-muted uppercase mb-1">Peer Benchmark</div>
          <div className="text-sm font-bold text-light-text dark:text-dark-text">VeriClear</div>
          <div className="text-xs text-green-500 font-medium">90% Faster QA</div>
        </div>
        <div>
          <div className="text-xs text-light-muted dark:text-dark-muted uppercase mb-1">Peer Benchmark</div>
          <div className="text-sm font-bold text-light-text dark:text-dark-text">Marketing Ops</div>
          <div className="text-xs text-green-500 font-medium">92% Time Saved</div>
        </div>
        <div className="col-span-2 flex items-center justify-end">
          <div className="text-right">
            <div className="text-xs text-light-muted dark:text-dark-muted">Projected Efficiency Gain</div>
            <div className="text-xl font-bold text-brand dark:text-brand-light">~85% <span className="text-[10px] block font-normal text-light-muted dark:text-dark-muted">Modelled at ${brief.hourlyRate}/hr</span></div>
          </div>
        </div>
      </div>
    </section>
  );
};
