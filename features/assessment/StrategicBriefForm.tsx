import React, { useRef, useEffect, useState } from 'react';
import { useLeadStore } from '../../store/leadStore';
import { useUIStore } from '../../store/uiStore';
// Added missing import for qualificationScore
import { useInteractionStore } from '../../store/interactionStore';
import { z } from 'zod';
import { useTerminalReveal } from '../../components/animations/useTerminalReveal';
import { TerminalLoader } from '../../components/ui/TerminalLoader';
import { StepBottlenecks } from './components/StepBottlenecks';
import { StepOutcomes } from './components/StepOutcomes';
import { StepMultiplier } from './components/StepMultiplier';
import { StepIdentity } from './components/StepIdentity';
import { FormNavigation } from './components/FormNavigation';
import { BriefSuccess } from './components/BriefSuccess';
import { LeadSanitySchema } from '../../schemas/integrity';

export const StrategicBriefForm: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef<HTMLDivElement>(null);
  
  const { 
    brief, 
    setBriefData, 
    formStep, 
    setFormStep, 
    calculatedROI,
    isSubmitting,
    setSubmitting,
    setAuditComplete,
  } = useLeadStore();

  // Fix: Property 'qualificationScore' correctly accessed from interaction store
  const { qualificationScore } = useInteractionStore();
  
  const { setView } = useUIStore();
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Initial reveal
  useTerminalReveal(containerRef, { delay: 0 });

  // Animate step transitions
  useEffect(() => {
    if (stepRef.current) {
       stepRef.current.animate([
           { opacity: 0, transform: 'translateX(20px)' },
           { opacity: 1, transform: 'translateX(0)' }
       ], {
           duration: 400,
           easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
           fill: 'forwards'
       });
    }
  }, [formStep]);

  const handleNext = () => {
     setFormStep(formStep + 1);
  };

  const handleSubmit = async () => {
      try {
          // REVENUE GUARD: Validation mapped to central Integrity Schema
          LeadSanitySchema.parse({
            email: brief.email,
            staffCount: brief.staffCount,
            estimatedWastedHours: brief.hoursWasted,
            qualificationScore: qualificationScore || 0
          });

          // Secondary check for bottlenecks (not in LeadSanitySchema but required for UX)
          if (brief.bottlenecks.length === 0) {
            setErrors({ bottlenecks: "Please select at least one friction point" });
            setFormStep(1);
            return;
          }

          setErrors({});
          setSubmitting(true);
          
          // Simulate Terminal Data Stream API call
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          setSubmitting(false);
          setAuditComplete(true);
          setShowSuccess(true);
      } catch (err) {
          if (err instanceof z.ZodError) {
              const fieldErrors: Record<string, string> = {};
              // Fix: ZodError uses 'issues' property for iteration
              err.issues.forEach(e => {
                  if (e.path[0]) fieldErrors[e.path[0].toString()] = e.message;
              });
              setErrors(fieldErrors);
              
              // Direct user to the step containing the error
              if (fieldErrors.email) setFormStep(4);
              else if (fieldErrors.estimatedWastedHours || fieldErrors.staffCount) setFormStep(3);
          }
      }
  };

  if (showSuccess) {
    return <BriefSuccess calculatedROI={calculatedROI} email={brief.email} onViewDashboard={() => setView('dashboard')} />;
  }

  if (isSubmitting) {
      return (
          <div className="h-full flex flex-col items-center justify-center p-8">
              <TerminalLoader className="w-full max-w-md h-64" />
          </div>
      );
  }

  return (
    <article ref={containerRef} className="bg-white dark:bg-dark-card border-l border-light-border dark:border-dark-border h-full flex flex-col opacity-0">
        {/* Progress Bar */}
        <div className="p-6 border-b border-light-border dark:border-dark-border" aria-hidden="true">
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-mono uppercase text-brand dark:text-brand-light">Strategic Brief</span>
                <span className="text-xs font-mono text-light-muted dark:text-dark-muted">Step {formStep} of 4</span>
            </div>
            <div className="h-1 w-full bg-light-bg dark:bg-dark-bg rounded-full overflow-hidden">
                <div 
                    className="h-full bg-brand dark:bg-brand-light transition-all duration-500 ease-out" 
                    style={{ width: `${(formStep / 4) * 100}%` }}
                ></div>
            </div>
        </div>

        {/* Step Content */}
        <div className="flex-grow p-8 overflow-y-auto no-scrollbar">
            <div ref={stepRef}>
                {formStep === 1 && (
                    <StepBottlenecks 
                      bottlenecks={brief.bottlenecks} 
                      setBottlenecks={(val) => setBriefData({ bottlenecks: val })} 
                      error={errors.bottlenecks}
                    />
                )}
                {formStep === 2 && (
                    <StepOutcomes 
                      goals={brief.goals} 
                      setGoals={(val) => setBriefData({ goals: val })}
                    />
                )}
                {formStep === 3 && (
                    <StepMultiplier 
                      staffCount={brief.staffCount}
                      hoursWasted={brief.hoursWasted}
                      calculatedROI={calculatedROI}
                      setStaffCount={(val) => setBriefData({ staffCount: val })}
                      setHoursWasted={(val) => setBriefData({ hoursWasted: val })}
                    />
                )}
                {formStep === 4 && (
                    <StepIdentity 
                      email={brief.email}
                      setEmail={(val) => setBriefData({ email: val })}
                      error={errors.email}
                    />
                )}
            </div>
        </div>

        {/* Footer Actions */}
        <FormNavigation 
          step={formStep}
          totalSteps={4}
          onBack={() => setFormStep(formStep - 1)}
          onNext={handleNext}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
    </article>
  );
};