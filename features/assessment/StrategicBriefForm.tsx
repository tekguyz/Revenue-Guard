
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

  // Initial reveal for the whole form container
  useTerminalReveal(containerRef, { delay: 0 });

  const updateField = (data: Partial<typeof brief>) => {
    setBriefData(data);
    
    // Auto-clear error when field is updated
    if (formStep === 4) {
      setErrors({});
    } else {
      setErrors(prev => {
        const next = { ...prev };
        Object.keys(data).forEach(k => {
          delete next[k];
          if (k === 'hoursWasted') delete next['estimatedWastedHours'];
          if (k === 'scheduledTime') delete next['scheduledTime'];
          if (k === 'email') delete next['email'];
        });
        return next;
      });
    }
  };

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
      if (e) {
          e.preventDefault();
          e.stopPropagation();
      }
      
      setErrors({});
      
      try {
          // Validation Step 1: Bottlenecks (Manual check for UI feedback)
          if (brief.bottlenecks.length === 0) {
            setErrors({ bottlenecks: "Select at least one friction point" });
            setFormStep(1);
            return;
          }

          // Validation Step 2: Zod Integrity Shield
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
              
              if (["staffCount", "estimatedWastedHours", "hourlyRate"].includes(path)) {
                targetStep = 3;
              } else if (["email", "scheduledTime"].includes(path)) {
                targetStep = 4;
              }
            });
            
            setErrors(fieldErrors);
            if (targetStep !== formStep) setFormStep(targetStep);
            
            // Visual Shake Feedback
            containerRef.current?.animate([
                { transform: 'translateX(0)' },
                { transform: 'translateX(-5px)' },
                { transform: 'translateX(5px)' },
                { transform: 'translateX(0)' }
            ], { duration: 300 });

            return;
          }

          // Proceeding to Secure Submission
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

          if (!response.ok) {
            throw new Error(`Netlink Error: ${response.status} ${response.statusText}`);
          }

          // Success Logic
          setAuditComplete(true);
          setShowSuccess(true);
      } catch (err) {
          console.error("Critical Brief Dispatch Error:", err);
          setErrors({ global: "The intelligence link rejected the payload. Ensure your business email is correctly formatted and try again." });
      } finally {
          setSubmitting(false);
      }
  };

  if (showSuccess) {
    return (
      <div className="h-full bg-white border-l border-light-border shadow-2xl overflow-hidden">
        <BriefSuccess 
          calculatedROI={calculatedROI} 
          email={brief.email} 
          scheduledTime={brief.scheduledTime} 
          onViewDashboard={() => setView('dashboard')} 
        />
      </div>
    );
  }

  if (isSubmitting) {
      return (
          <div className="h-full flex flex-col items-center justify-center p-8 bg-black border-l border-light-border shadow-2xl overflow-hidden">
              <TerminalLoader className="w-full flex-grow h-full" />
              <p className="mt-6 text-[10px] font-mono text-brand animate-pulse uppercase tracking-[0.3em] font-black">Dispatching Intelligence Payload...</p>
          </div>
      );
  }

  return (
    <article ref={containerRef} className="bg-white border-l border-light-border h-full flex flex-col opacity-0 overflow-hidden shadow-2xl transition-opacity duration-300">
        <form 
          name="strategic-brief" 
          method="POST" 
          data-netlify="true" 
          onSubmit={handleSubmit} 
          className="contents"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
            }
          }}
        >
          {/* Netlify form hidden identify field */}
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
                <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-mono uppercase text-center animate-in fade-in slide-in-from-top-2">
                  <div className="font-black mb-1 text-[10px]">Dispatch Failed</div>
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
