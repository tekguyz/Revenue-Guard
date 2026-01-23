import React from 'react';

interface StepBottlenecksProps {
  bottlenecks: string[];
  setBottlenecks: (bottlenecks: string[]) => void;
  error?: string;
}

export const StepBottlenecks: React.FC<StepBottlenecksProps> = ({ bottlenecks, setBottlenecks, error }) => {
  const options = ["Manual Data Entry", "Meeting Overload", "Legacy Tech Debt", "Communication Silos", "Approval Delays"];

  const toggleOption = (opt: string) => {
    if (bottlenecks.includes(opt)) {
      setBottlenecks(bottlenecks.filter(x => x !== opt));
    } else {
      setBottlenecks([...bottlenecks, opt]);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-light-text dark:text-dark-text">Bottleneck Deep-Dive</h2>
        <p className="text-light-muted dark:text-dark-muted">Identify the primary friction points in your current workflow.</p>
      </header>
      
      <div className="space-y-3" role="group" aria-label="Select Bottlenecks">
        {options.map((opt) => (
          <label 
            key={opt} 
            className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all duration-200 touch-target ${bottlenecks.includes(opt) ? 'border-brand bg-brand/5 dark:bg-brand-light/5 ring-1 ring-brand' : 'border-light-border dark:border-dark-border hover:border-brand/50'}`}
          >
            <input 
              type="checkbox" 
              className="w-5 h-5 rounded border-gray-300 text-brand focus:ring-brand"
              checked={bottlenecks.includes(opt)}
              onChange={() => toggleOption(opt)}
              aria-label={opt}
            />
            <span className="ml-3 font-medium text-light-text dark:text-dark-text">{opt}</span>
          </label>
        ))}
      </div>
      {error && <p className="text-red-500 text-sm mt-2" role="alert">{error}</p>}
    </div>
  );
};