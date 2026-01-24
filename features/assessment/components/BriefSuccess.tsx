
import React from 'react';
import { Check, LayoutDashboard, Calendar, Mail } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { ROICounter } from '../../../components/ui/ROICounter';

interface BriefSuccessProps {
  calculatedROI: number;
  email: string;
  scheduledTime?: string;
  onViewDashboard: () => void;
}

export const BriefSuccess: React.FC<BriefSuccessProps> = ({ 
  calculatedROI, 
  email, 
  scheduledTime,
  onViewDashboard 
}) => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-brand/5 border-l border-brand/20 text-center animate-in fade-in zoom-in duration-500 overflow-y-auto no-scrollbar">
      <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-500/30 ring-4 ring-green-500/10 flex-shrink-0">
        <Check className="w-10 h-10 text-white" />
      </div>
      
      <h2 className="text-3xl font-bold mb-2 text-light-text">Intelligence Secure</h2>
      <p className="text-light-muted mb-8 max-w-sm">
        Your ROI model has been dispatched. A confirmation link has been sent to your corporate address.
      </p>

      <div className="grid gap-4 w-full max-w-sm mb-8 flex-shrink-0">
        <div className="bg-white p-6 rounded-2xl border border-brand/30 shadow-xl text-center">
          <p className="text-[10px] text-brand uppercase tracking-widest font-bold mb-2">Projected Recovery</p>
          <ROICounter value={calculatedROI} />
        </div>

        <div className="bg-black/5 rounded-2xl p-4 space-y-3 text-left border border-light-border">
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-brand" />
            <span className="text-sm font-medium truncate">{email}</span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium">{scheduledTime || "Pending Verification"}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4 w-full max-w-sm flex-shrink-0">
        <Button onClick={onViewDashboard} className="w-full py-4 text-lg" aria-label="Open Command Center">
          <LayoutDashboard className="w-5 h-5 mr-2" />
          Access Command Center
        </Button>
        <p className="text-[10px] uppercase font-mono text-light-muted">
          Principal Strategist Contact: 2-Hour Response SLA
        </p>
      </div>
    </div>
  );
};
