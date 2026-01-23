import React from 'react';
import { Target, Lightbulb } from 'lucide-react';

interface StepOutcomesProps {
  goals: string;
  setGoals: (goals: string) => void;
}

export const StepOutcomes: React.FC<StepOutcomesProps> = ({ goals, setGoals }) => {
  const suggestions = [
    "Reduce report generation time by 50%",
    "Automate 100% of CRM data entry",
    "Decrease meeting frequency by 3h/week",
    "Streamline executive sign-off protocol"
  ];

  return (
    <div className="space-y-6">
      <header>
        <div className="flex items-center gap-2 mb-1">
            <Target className="w-5 h-5 text-brand" />
            <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">Target ROI Velocity</h2>
        </div>
        <p className="text-light-muted dark:text-dark-muted">What is the single most important metric we should target first?</p>
      </header>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
            {suggestions.map((s, i) => (
                <button 
                    key={i}
                    type="button"
                    onClick={() => setGoals(s)}
                    className="text-[10px] uppercase font-mono px-3 py-1.5 rounded-full border border-light-border dark:border-dark-border hover:border-brand hover:text-brand transition-colors text-light-muted dark:text-dark-muted"
                >
                    + {s}
                </button>
            ))}
        </div>

        <div className="relative">
            <div className="absolute top-4 left-4 opacity-30">
                <Lightbulb className="w-4 h-4" />
            </div>
            <textarea 
                className="w-full h-48 pl-12 pr-4 py-4 rounded-xl bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border focus:ring-2 focus:ring-brand focus:border-transparent resize-none text-light-text dark:text-dark-text text-base leading-relaxed placeholder:opacity-30"
                placeholder="Describe your primary strategic objective..."
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                aria-label="Target Outcomes Description"
            ></textarea>
        </div>
      </div>
    </div>
  );
};