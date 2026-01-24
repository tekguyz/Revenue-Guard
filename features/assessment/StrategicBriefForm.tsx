
import React, { useRef, useEffect, useState } from 'react';
import { useLeadStore } from '../../store/leadStore';
import { useUIStore } from '../../store/uiStore';
import { useInteractionStore } from '../../store/interactionStore';
import { useTerminalReveal } from '../../components/animations/useTerminalReveal';
import { TerminalLoader } from '../../components/ui/TerminalLoader';
import { StepBottlenecks } from './components/StepBottlenecks';
import { StepOutcomes } from './components/StepOutcomes';
import { StepMultiplier } from './components/StepMultiplier';
import { StepIdentity } from './components/StepIdentity';
import { FormNavigation } from './components/FormNavigation';
import { BriefSuccess } from './components/BriefSuccess';
import { LeadSanitySchema } from '../../schemas/integrity';

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

  // 1. Reactive Error Clearing: Remove error for a field when its value changes
  const updateField = (data: Partial<typeof brief>) => {
    setBriefData(data);
    const keys = Object.keys(data);
    if (keys.length > 0) {
      setErrors(prev => {
        const next = { ...prev };
        keys.forEach(k => {
          delete next[k];
          // Special cases for mapped fields
          if (k === 'hoursWasted') delete next['estimatedWastedHours'];
          if (k === 'scheduledTime') delete next['scheduledTime'];
        });
        return next;
      });
    }
  };

  useEffect(() => {
    setErrors({});
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
      
      // Clear all errors before re-validating
      setErrors({});
      
      try {
          // Check bottlenecks manually first
          if (brief.bottlenecks.length === 0) {
            setErrors({ bottlenecks: "Select at least one friction point" });
            setFormStep(1);
            return;
          }

          // Full schema validation
          const validationResult = LeadSanitySchema.safeParse({
            email: brief.email,
            staffCount: brief.staffCount,
            estimatedWastedHours: brief.hoursWasted,
            hourlyRate: brief.hourlyRate,
            qualificationScore: qualificationScore || 0,
            scheduledTime: brief.scheduledTime || ""
          });

          if (!validationResult.success) {
            const fieldErrors: Record<string, string> = {};
            let targetStep = formStep;
            
            validationResult.error.issues.forEach(issue => {
              const path = issue.path[0]?.toString() || "";
              fieldErrors[path] = issue.message;
              
              // Map error to correct step if not on current
              if (["staffCount", "estimatedWastedHours", "hourlyRate"].includes(path) && targetStep === formStep) {
                targetStep = 3;
              } else if (["email", "scheduledTime"].includes(path) && targetStep === formStep) {
                targetStep = 4;
              }
            });
            
            setErrors(fieldErrors);
            if (targetStep !== formStep) setFormStep(targetStep);
            
            // Visual feedback that "Something happened" (Shake)
            containerRef.current?.animate([
                { transform: 'translateX(0)' },
                { transform: 'translateX(-5px)' },
                { transform: 'translateX(5px)' },
                { transform: 'translateX(0)' }
            ], { duration: 300 });

            return;
          }

          // If we reach here, validation passed
          setSubmitting(true);
          
          const formData = {
            "form-name": "strategic-brief",
            email: brief.email,
            staffCount: brief.staffCount,
            hoursWastedPerPerson: brief.hoursWasted,
            hourlyRate: brief.hourlyRate,
            bottlenecks: brief.bottlenecks.join(", "),
            goals: brief.goals,
            scheduledTime: brief.scheduledTime,
            roiProjection: calculatedROI,
            qualificationScore: qualificationScore
          };

          const response = await fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: encode(formData)
          });

          if (!response.ok) throw new Error("Netlify Form Dispatch Failed");

          setAuditComplete(true);
          setShowSuccess(true);
      } catch (err) {
          console.error("System Error during Brief Dispatch:", err);
          setErrors({ global: "Intelligence link disrupted. Re-initializing secure link..." });
      } finally {
          setSubmitting(false);
      }
  };

  if (showSuccess) return <BriefSuccess calculatedROI={calculatedROI} email={brief.email} scheduledTime={brief.scheduledTime} onViewDashboard={() => setView('dashboard')} />;

  if (isSubmitting) {
      return (
          <div className="h-full flex flex-col items-center justify-center p-8 bg-white">
              <TerminalLoader className="w-full max-w-md h-64" />
              <p className="mt-4 text-xs font-mono text-brand animate-pulse uppercase tracking-widest font-black">Securing Intelligence Vault...</p>
          </div>
      );
  }

  return (
    <article ref={containerRef} className="bg-white border-l border-light-border h-full flex flex-col opacity-0 overflow-hidden shadow-2xl">
        <form name="strategic-brief" method="POST" data-netlify="true" onSubmit={handleSubmit} className="contents">
          <input type="hidden" name="form-name" value="strategic-brief" />
          <div className="p-6 border-b border-light-border bg-white sticky top-0 z-10" aria-hidden="true">
              <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-mono uppercase text-brand font-black tracking-widest">Strategic Assessment Protocol</span>
                  <span className="text-[10px] font-mono text-light-muted font-bold">Sequence {formStep}/4</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand transition-all duration-500 ease-out shadow-[0_0_8px_#3500D3]" style={{ width: `${(formStep / 4) * 100}%` }}></div>
              </div>
          </div>
          <div className="flex-grow p-8 overflow-y-auto no-scrollbar pb-24">
              <div ref={stepRef}>
                  {formStep === 1 && <StepBottlenecks bottlenecks={brief.bottlenecks} setBottlenecks={(val) => updateField({ bottlenecks: val })} error={errors.bottlenecks} />}
                  {formStep === 2 && <StepOutcomes goals={brief.goals} setGoals={(val) => updateField({ goals: val })} />}
                  {formStep === 3 && (
                    <StepMultiplier 
                        staffCount={brief.staffCount} 
                        hoursWasted={brief.hoursWasted} 
                        hourlyRate={brief.hourlyRate}
                        calculatedROI={calculatedROI} 
                        setStaffCount={(val) => updateField({ staffCount: val })} 
                        setHoursWasted={(val) => updateField({ hoursWasted: val })} 
                        setHourlyRate={(val) => updateField({ hourlyRate: val })}
                        error={errors.staffCount || errors.estimatedWastedHours || errors.hourlyRate} 
                    />
                  )}
                  {formStep === 4 && (
                    <StepIdentity 
                      email={brief.email} 
                      setEmail={(val) => updateField({ email: val })} 
                      scheduledTime={brief.scheduledTime} 
                      onSelectTime={(val) => updateField({ scheduledTime: val })} 
                      emailError={errors.email}
                      timeError={errors.scheduledTime}
                    />
                  )}
              </div>
              {errors.global && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs font-mono uppercase text-center animate-pulse">
                  {errors.global}
                </div>
              )}
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
