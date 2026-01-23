import React from 'react';

interface StepOutcomesProps {
  goals: string;
  setGoals: (goals: string) => void;
}

export const StepOutcomes: React.FC<StepOutcomesProps> = ({ goals, setGoals }) => {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">Target Outcomes</h2>
        <p className="text-light-muted dark:text-dark-muted">What is the single most important metric you want to improve?</p>
      </header>
      <textarea 
        className="w-full h-40 p-4 rounded-xl bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border focus:ring-2 focus:ring-brand focus:border-transparent resize-none text-light-text dark:text-dark-text text-base"
        placeholder="e.g., Reduce report generation time by 50%..."
        value={goals}
        onChange={(e) => setGoals(e.target.value)}
        aria-label="Target Outcomes Description"
      ></textarea>
    </div>
  );
};