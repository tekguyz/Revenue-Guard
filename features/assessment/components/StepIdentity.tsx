
import React from 'react';
import { ShieldCheck, Mail, AlertCircle, Calendar } from 'lucide-react';
import { BriefingScheduler } from '../../../components/ui/BriefingScheduler';

interface StepIdentityProps {
  email: string;
  setEmail: (val: string) => void;
  scheduledTime?: string;
  onSelectTime: (time: string) => void;
  emailError?: string;
  timeError?: string;
}

export const StepIdentity: React.FC<StepIdentityProps> = ({ 
  email, 
  setEmail, 
  scheduledTime, 
  onSelectTime, 
  emailError,
  timeError
}) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <header>
        <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-brand" />
            <h2 className="text-2xl font-bold text-light-text">Final Handover</h2>
        </div>
        <p className="text-light-muted">Your ROI model is ready. Connect with a Principal Strategist to secure the vault.</p>
      </header>
      
      <div className="space-y-6">
        <div className="group">
          <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium mb-2 text-light-text">
            <Mail className="w-4 h-4 text-brand" />
            Corporate Intelligence Link
          </label>
          <div className="relative">
            <input 
              id="email"
              type="email" 
              className={`w-full p-4 rounded-xl bg-light-bg border transition-all ${emailError ? 'border-red-500 ring-2 ring-red-500/10' : 'border-light-border focus:ring-2 focus:ring-brand'} text-light-text text-base font-medium`}
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!emailError}
            />
            {emailError && (
              <div className="absolute -bottom-6 left-0 flex items-center gap-1 text-red-500 text-[10px] font-bold uppercase tracking-wider animate-in slide-in-from-top-1">
                <AlertCircle className="w-3 h-3" /> {emailError}
              </div>
            )}
          </div>
        </div>

        <div className="pt-8 border-t border-light-border">
          <label className="flex items-center gap-2 text-sm font-medium mb-4 text-light-text">
            <Calendar className="w-4 h-4 text-brand" />
            Select Briefing Window
          </label>
          <div className={`rounded-2xl transition-all ${timeError ? 'p-1 ring-2 ring-red-500/20 bg-red-50/50' : ''}`}>
            <BriefingScheduler 
              selectedTime={scheduledTime}
              onSelect={onSelectTime}
            />
          </div>
          {timeError && (
            <div className="mt-3 flex items-center justify-center gap-1 text-red-500 text-[10px] font-bold uppercase tracking-wider bg-red-50 p-2 rounded-lg border border-red-100 animate-pulse">
              <AlertCircle className="w-3 h-3" /> {timeError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
