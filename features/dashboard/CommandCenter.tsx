import React, { useState } from 'react';
import { useLeadStore } from '../../store/leadStore';
import { useInteractionStore } from '../../store/interactionStore';
import { EfficiencyGauge } from '../../components/ui/EfficiencyGauge';
import { ROICounter } from '../../components/ui/ROICounter';
import { Button } from '../../components/ui/Button';
import { ShieldCheck } from 'lucide-react';
import { FinalPayloadSchema } from '../../schemas/finalPayload';
import { SystemHandoverOverlay } from '../../components/ui/SystemHandoverOverlay';
import { dispatchLeadToCRM } from '../../services/dispatcher';

// Atomic Components
import { DashboardHeader } from './components/DashboardHeader';
import { MetricCard } from './components/MetricCard';
import { AutomationRoadmap } from './components/AutomationRoadmap';
import { RecoveryTrajectory } from './components/RecoveryTrajectory';

export const CommandCenter: React.FC = () => {
  const { brief, calculatedROI } = useLeadStore();
  const { qualificationScore, leadData } = useInteractionStore();
  
  const [isHandingOver, setIsHandingOver] = useState(false);
  const [handoverComplete, setHandoverComplete] = useState(false);

  // Derive Data
  const monthlySavings = calculatedROI / 12;
  const displayScore = qualificationScore > 0 ? qualificationScore : 8; // Default to 8 for demo if undefined
  
  const handleSecureSprint = async () => {
    // 1. Validate Payload (Security Shield)
    try {
        const payload = {
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            lead: {
                company: leadData.company || "Unspecified",
                email: brief.email,
                metrics: {
                    wastedHours: brief.hoursWasted,
                    potentialSavings: calculatedROI,
                    score: displayScore
                }
            },
            transcript_hash: `sha256-${Date.now()}` // Mock hash
        };

        const validated = FinalPayloadSchema.parse(payload);
        
        // 2. Trigger Visual Handover
        setIsHandingOver(true);
        
        // 3. Actual Dispatch (Simulated)
        console.log("Secure Payload:", validated);
        await dispatchLeadToCRM(validated); 

    } catch (e) {
        console.error("Payload Security Validation Failed", e);
        alert("Security Integrity Check Failed. Please verify inputs.");
    }
  };

  if (isHandingOver) {
      return <SystemHandoverOverlay onComplete={() => {
          setIsHandingOver(false);
          setHandoverComplete(true);
      }} />;
  }

  if (handoverComplete) {
      return (
          <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
              <div className="w-24 h-24 bg-brand/10 dark:bg-brand-light/10 rounded-full flex items-center justify-center mb-6 ring-1 ring-brand/30">
                  <ShieldCheck className="w-12 h-12 text-brand dark:text-brand-light" />
              </div>
              <h1 className="text-3xl font-bold mb-4 text-light-text dark:text-dark-text">Phase 1 Initialized</h1>
              <p className="text-light-muted dark:text-dark-muted max-w-md mx-auto mb-8">
                  Your strategy data has been secured in the TEKGUYZ vault. A Principal Strategist is reviewing your efficiency model and will contact {brief.email} within 2 hours.
              </p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                  Return to Base
              </Button>
          </div>
      );
  }

  return (
    <div className="space-y-8 pb-12 opacity-0 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-forwards">
      <DashboardHeader onSecureSprint={handleSecureSprint} />

      {/* Intelligence Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6" aria-label="Key Metrics">
        
        <MetricCard 
          title="Efficiency Score" 
          description="Your workflow efficiency relative to peer benchmarks in the TEKGUYZ index."
          gradient="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 opacity-20"
        >
           <EfficiencyGauge score={displayScore} />
        </MetricCard>

        <MetricCard 
          title="Projected Recovery" 
          description="Estimated capital recovered annually through Phase 1 Automation Implementation."
          gradient="bg-accent dark:bg-accent-light opacity-50"
          borderColorClass="hover:border-accent/30"
        >
           <div className="scale-125 my-4">
              <ROICounter value={calculatedROI} />
           </div>
        </MetricCard>

        <AutomationRoadmap bottlenecks={brief.bottlenecks} />
      </section>

      {/* Visualization Area */}
      <RecoveryTrajectory monthlySavings={monthlySavings} />

    </div>
  );
};