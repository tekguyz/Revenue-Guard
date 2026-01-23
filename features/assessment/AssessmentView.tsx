import React, { useRef } from 'react';
import { useTerminalReveal } from '../../components/animations/useTerminalReveal';
import { FileCheck, ChevronRight } from 'lucide-react';

export const AssessmentView: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  useTerminalReveal(containerRef, { delay: 100 });

  const steps = [
    "Company Information",
    "Revenue Goals",
    "Current Challenges",
    "Team Structure"
  ];

  return (
    <div ref={containerRef} className="max-w-3xl mx-auto opacity-0">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <FileCheck className="w-6 h-6 text-brand" />
          Strategic Assessment
        </h2>
        <span className="text-sm font-mono text-brand bg-brand/10 px-3 py-1 rounded-full">Step 1 of 4</span>
      </div>

      <div className="grid gap-6">
         {/* Simulated Steps */}
         <div className="bg-white dark:bg-dark-card p-6 rounded-xl border border-light-border dark:border-dark-border shadow-lg">
            <h3 className="text-lg font-semibold mb-6">Organization Profile</h3>
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 bg-light-bg dark:bg-dark-bg rounded-lg w-full animate-pulse opacity-50"></div>
                ))}
            </div>
            <div className="mt-8 flex justify-end">
                <button className="flex items-center gap-2 text-brand font-medium hover:underline">
                    Next Step <ChevronRight className="w-4 h-4" />
                </button>
            </div>
         </div>
      </div>
    </div>
  );
};