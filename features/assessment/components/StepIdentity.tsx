import React from 'react';
import { Calendar } from 'lucide-react';

interface StepIdentityProps {
  email: string;
  setEmail: (val: string) => void;
  error?: string;
}

export const StepIdentity: React.FC<StepIdentityProps> = ({ email, setEmail, error }) => {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">Intelligence Sprint</h2>
        <p className="text-light-muted dark:text-dark-muted">Finalize your request. We will schedule a 15-minute briefing.</p>
      </header>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2 text-light-text dark:text-dark-text">Business Email</label>
        <input 
          id="email"
          type="email" 
          className={`w-full p-3 rounded-xl bg-light-bg dark:bg-dark-bg border ${error ? 'border-red-500' : 'border-light-border dark:border-dark-border'} focus:ring-2 focus:ring-brand text-light-text dark:text-dark-text text-base`}
          placeholder="name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? "email-error" : undefined}
        />
        {error && <p id="email-error" className="text-red-500 text-sm mt-1" role="alert">{error}</p>}
      </div>

      {/* Simulated Cal.com Embed Placeholder */}
      <button 
        type="button"
        className="w-full border border-dashed border-light-border dark:border-dark-border rounded-xl p-6 flex flex-col items-center justify-center text-center bg-light-bg/50 dark:bg-dark-bg/50 hover:bg-light-bg dark:hover:bg-dark-bg transition-colors cursor-pointer group"
        aria-label="Select a Briefing Time"
      >
        <Calendar className="w-8 h-8 text-light-muted dark:text-dark-muted mb-3 group-hover:text-brand dark:group-hover:text-brand-light transition-colors" />
        <p className="text-sm font-medium text-light-text dark:text-dark-text">Select a Briefing Time</p>
        <p className="text-xs text-light-muted dark:text-dark-muted">Calendar will open in overlay</p>
      </button>
    </div>
  );
};