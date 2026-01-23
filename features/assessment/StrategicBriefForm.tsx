import React, { useRef, useEffect, useState } from 'react';
import { useLeadStore } from '../../store/leadStore';
import { useUIStore } from '../../store/uiStore';
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

// Helper for Netlify Form Submission
const encode = (data: Record<string, any>) => {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
};

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

  const { qualificationScore } = useInteractionStore();
  const { setView } = useUIStore();
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  useTerminalReveal(containerRef, { delay: 0 });

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

  const handleSubmit = async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      
      try {
          // Validation
          LeadSanitySchema.parse({
            email: brief.email,
            staffCount: brief.staffCount,
            estimatedWastedHours: brief.hoursWasted,
            qualificationScore: qualificationScore || 0,
            scheduledTime: brief.scheduledTime
          });

          if (brief.bottlenecks.length === 0) {
            setErrors({ bottlenecks: "Select at least one friction point" });
            setFormStep(1);
            return;
          }

          setErrors({});
          setSubmitting(true);
          
          // Netlify Form Submission
          const formData = {
            "form-name": "strategic-brief",
            email: brief.email,
            staffCount: brief.staffCount,
            hoursWastedPerPerson: brief.hoursWasted,
            bottlenecks: brief.bottlenecks.join(", "),
            goals: brief.goals,
            scheduledTime: brief.scheduledTime,
            roiProjection: calculatedROI,
            qualificationScore: qualificationScore
          };

          await fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: encode(formData)
          });
          
          setSubmitting(false);
          setAuditComplete(true);
          setShowSuccess(true);
      } catch (err) {
          if (err instanceof z.ZodError) {
              const fieldErrors: Record<string, string> = {};
              err.issues.forEach(e => {
                  if (e.path[0]) fieldErrors[e.path[0].toString()] = e.message;
              });
              setErrors(fieldErrors);
              
              if (fieldErrors.email || fieldErrors.scheduledTime) setFormStep(4);
              else if (fieldErrors.estimatedWastedHours || fieldErrors.staffCount) setFormStep(3);
          }
      }
  };

  if (showSuccess) {
    return (
      <BriefSuccess 
        calculatedROI={calculatedROI} 
        email={brief.email} 
        scheduledTime={brief.scheduledTime}
        onViewDashboard={() => setView('dashboard')} 
      />
    );
  }

  if (isSubmitting) {
      return (
          <div className="h-full flex flex-col items-center justify-center p-8">
              <TerminalLoader className="w-full max-w-md h-64" />
              <p className="mt-4 text-xs font-mono text-brand animate-pulse uppercase tracking-widest">Securing Vault Entry...</p>
          </div>
      );
  }

  return (
    <article ref={containerRef} className="bg-white dark:bg-dark-card border-l border-light-border dark:border-dark-border h-full flex flex-col opacity-0 overflow-hidden">
        {/* Netlify Form Detection Attributes */}
        <form 
          name="strategic-brief" 
          method="POST" 
          data-netlify="true" 
          onSubmit={handleSubmit}
          className="contents"
        >
          <input type="hidden" name="form-name" value="strategic-brief" />
          
          <div className="p-6 border-b border-light-border dark:border-dark-border bg-white dark:bg-dark-card sticky top-0 z-10" aria-hidden="true">
              <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-mono uppercase text-brand dark:text-brand-light font-bold tracking-widest">Strategic Assessment Protocol</span>
                  <span className="text-[10px] font-mono text-light-muted dark:text-dark-muted">Sequence {formStep}/4</span>
              </div>
              <div className="h-1 w-full bg-light-bg dark:bg-dark-bg rounded-full overflow-hidden">
                  <div 
                      className="h-full bg-brand dark:bg-brand-light transition-all duration-500 ease-out shadow-[0_0_8px_#3500D3]" 
                      style={{ width: `${(formStep / 4) * 100}%` }}
                  ></div>
              </div>
          </div>

          <div className="flex-grow p-8 overflow-y-auto no-scrollbar pb-24">
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
                        scheduledTime={brief.scheduledTime}
                        onSelectTime={(val) => setBriefData({ scheduledTime: val })}
                        error={errors.email || errors.scheduledTime}
                      />
                  )}
              </div>
          </div>

          <FormNavigation 
            step={formStep}
            totalSteps={4}
            onBack={() => setFormStep(formStep - 1)}
            onNext={handleNext}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </form>
    </article>
  );
};