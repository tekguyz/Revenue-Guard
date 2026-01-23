import React from 'react';
import { ROICounter } from '../../../components/ui/ROICounter';
import { Users, Timer, ArrowRight, Zap } from 'lucide-react';

interface StepMultiplierProps {
  staffCount: number;
  hoursWasted: number;
  calculatedROI: number;
  setStaffCount: (val: number) => void;
  setHoursWasted: (val: number) => void;
  error?: string;
}

export const StepMultiplier: React.FC<StepMultiplierProps> = ({ 
  staffCount, 
  hoursWasted, 
  calculatedROI, 
  setStaffCount, 
  setHoursWasted,
  error
}) => {
  const totalWeeklyWasted = staffCount * hoursWasted;
  
  return (
    <div className="space-y-6">
      <header>
        <div className="flex items-center gap-2 mb-1">
            <Zap className="w-5 h-5 text-yellow-500" />
            <h2 className="text-2xl font-bold text-light-text">Scale Metrics</h2>
        </div>
        <p className="text-light-muted">Quantify the friction. We'll handle the projections.</p>
      </header>
      
      <div className="grid gap-4">
        <div className="group">
          <label htmlFor="staffCount" className="flex items-center gap-2 text-sm font-medium mb-2 text-light-text">
            <Users className="w-4 h-4 text-brand" />
            Impacted Team Size
          </label>
          <div className="relative">
            <input 
              id="staffCount"
              type="number" 
              className={`w-full p-4 rounded-xl bg-light-bg border ${error ? 'border-red-500' : 'border-light-border'} focus:ring-2 focus:ring-brand text-light-text text-lg font-bold`}
              placeholder="0"
              value={staffCount || ''}
              onChange={(e) => setStaffCount(parseInt(e.target.value) || 0)}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-light-muted uppercase">Staff</span>
          </div>
        </div>

        <div className="group">
          <label htmlFor="hoursWasted" className="flex items-center gap-2 text-sm font-medium mb-2 text-light-text">
            <Timer className="w-4 h-4 text-brand" />
            Avg. Weekly Hours Wasted <span className="text-accent font-bold">(Per Person)</span>
          </label>
          <div className="relative">
            <input 
              id="hoursWasted"
              type="number" 
              className={`w-full p-4 rounded-xl bg-light-bg border ${error ? 'border-red-500' : 'border-light-border'} focus:ring-2 focus:ring-brand text-light-text text-lg font-bold`}
              placeholder="0"
              value={hoursWasted || ''}
              onChange={(e) => setHoursWasted(parseInt(e.target.value) || 0)}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-light-muted uppercase">Hrs/Wk</span>
          </div>
          <p className="mt-2 text-[10px] text-light-muted leading-tight">
            Think manual data entry, unnecessary meetings, or cleaning broken reports.
          </p>
        </div>
      </div>

      {(staffCount > 0 && hoursWasted > 0) && (
        <div className="p-4 bg-black/5 rounded-xl border border-dashed border-light-border flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex flex-col">
                <span className="text-[10px] uppercase font-mono text-light-muted">Combined Team Impact</span>
                <span className="text-sm font-bold">{totalWeeklyWasted.toLocaleString()} hrs / week wasted</span>
            </div>
            <ArrowRight className="w-4 h-4 text-light-muted opacity-30" />
            <div className="flex flex-col text-right">
                <span className="text-[10px] uppercase font-mono text-light-muted">Annual Leakage</span>
                <span className="text-sm font-bold">{(totalWeeklyWasted * 52).toLocaleString()} hrs / year</span>
            </div>
        </div>
      )}

      <div className="mt-8 p-6 bg-accent/5 rounded-2xl border border-accent/20 text-center relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50 group-hover:scale-x-110 transition-transform"></div>
        <p className="text-xs uppercase tracking-widest text-accent font-bold mb-1">Projected Annual Recovery</p>
        <div className="py-2">
          <ROICounter value={calculatedROI} />
        </div>
        <p className="text-[10px] text-light-muted mt-2 opacity-70">
          Calculated at standard corporate blended rate ($65/hr).
        </p>
      </div>
      {error && <p className="text-red-500 text-[10px] font-mono uppercase text-center mt-2">{error}</p>}
    </div>
  );
};