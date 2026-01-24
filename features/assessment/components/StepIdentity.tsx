
import React from 'react';
import { ShieldCheck, Mail, AlertCircle } from 'lucide-react';
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
    <div className="space-y-8">
      <header>
        <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-brand" />
            <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">Final Handover</h2>
        </div>
        <p className="text-light-muted dark:text-dark-muted">Your ROI model is ready. Connect with a Principal Strategist to secure the vault.</p>
      </header>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium mb-2 text-light-text dark:text-dark-text">
            <Mail className="w-4 h-4 text-brand" />
            Corporate Intelligence Link (Email)
          </label>
          <input 
            id="email"
            type="email" 
            className={`w-full p-4 rounded-xl bg-light-bg dark:bg-dark-bg border ${emailError ? 'border-red-500 ring-1 ring-red-500' : 'border-light-border dark:border-dark-border'} focus:ring-2 focus:ring-brand text-light-text dark:text-dark-text text-base font-medium`}
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!emailError}
            aria-describedby={emailError ? "email-error" : undefined}
          />
          {emailError && (
            <p id="email-error" className="text-red-500 text-[10px] mt-1.5 font-mono uppercase tracking-tight flex items-center gap-1" role="alert">
              <AlertCircle className="w-3 h-3" /> {emailError}
            </p>
          )}
        </div>

        <div className="pt-4 border-t border-light-border dark:border-dark-border">
          <label className="block text-sm font-medium mb-4 text-light-text dark:text-dark-text">
            Pick your 15-minute Strategy Briefing
          </label>
          <BriefingScheduler 
            selectedTime={scheduledTime}
            onSelect={onSelectTime}
          />
          {timeError && (
            <p className="text-red-500 text-[10px] mt-3 font-mono uppercase tracking-tight flex items-center justify-center gap-1 bg-red-50 py-2 rounded-lg border border-red-100" role="alert">
              <AlertCircle className="w-3 h-3" /> {timeError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
