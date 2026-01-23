import { useState } from 'react';
import { useInteractionStore } from '../store/interactionStore';
import { useUIStore } from '../store/uiStore';
import { generateStrategistResponse } from '../services/gemini';
import { dispatchLeadToCRM } from '../services/dispatcher';
import { useLeadStore } from '../store/leadStore';
import { LeadSanitySchema } from '../schemas/integrity';

export const useStrategist = () => {
  const { 
    messages, 
    addMessage, 
    setTyping, 
    setQualification, 
    updateLeadData,
    leadData,
    qualificationScore
  } = useInteractionStore();

  const { calculateROI } = useLeadStore();
  const { setSystemStatus } = useUIStore();

  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    setError(null);
    setIsLoading(true);
    setTyping(true);
    setSystemStatus('optimal');

    // Add user message
    addMessage({ role: 'user', content });

    try {
      const history = messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      }));
      history.push({ role: 'user', parts: [{ text: content }] });

      // Timeout Race Logic (10s)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('TIMEOUT')), 10000)
      );

      const response = await Promise.race([
        generateStrategistResponse(history),
        timeoutPromise
      ]) as Awaited<ReturnType<typeof generateStrategistResponse>>;

      // Process Data
      if (response.data) {
        setQualification(response.data.score);
        
        if (response.data.bottleneck) {
          updateLeadData({ bottleneck: response.data.bottleneck });
        }
        if (response.data.company) {
            updateLeadData({ company: response.data.company });
        }

        // Trigger Phase 1 Logic with Sanity Check
        if (response.data.ready_for_phase_1) {
          
          // Data Integrity Verification
          const sanityCheck = LeadSanitySchema.safeParse({
             estimatedWastedHours: leadData.estimatedWastedHours || 0,
             qualificationScore: response.data.score
          });

          if (!sanityCheck.success) {
             // Anomaly Detected
             addMessage({
                role: 'strategist',
                content: "Our audit detects an anomaly in the data provided (Wasted Hours > 168/week). Please verify the weekly wasted hours to ensure an accurate ROI projection."
             });
             setSystemStatus('latent'); // Indicate minor issue
          } else {
             // Proceed with Dispatch
             setIsSyncing(true);
             try {
                const payload = {
                    leadData: { 
                        ...leadData, 
                        qualificationScore: response.data.score,
                        bottleneck: response.data.bottleneck || "Unspecified",
                        company: response.data.company || "Unspecified"
                    },
                    transcript: messages.concat([{ role: 'user', content }, { role: 'strategist', content: response.text, timestamp: Date.now() }]),
                    timestamp: new Date().toISOString()
                };
                
                await dispatchLeadToCRM(payload);
             } catch (e) {
                console.error("Sync failed", e);
                setSystemStatus('disconnected');
             } finally {
                setIsSyncing(false);
             }
          }
        }
      }

      // Add AI Message
      addMessage({ role: 'strategist', content: response.text });

    } catch (err: any) {
      if (err.message === 'TIMEOUT') {
        console.warn("Strategist: Latency Timeout Detected");
        setSystemStatus('latent');
        addMessage({
            role: 'strategist',
            content: "Analyzing high-concurrency data streams... our primary intelligence link is latent. Continue with the manual brief below while I re-establish the connection."
        });
        // Fail-forward: Reveal Form automatically
        setQualification(7); 
      } else {
        console.error("Strategist API Error", err);
        setSystemStatus('disconnected');
        setError("Strategic Intelligence Module offline. Retrying connection...");
        addMessage({ 
          role: 'strategist', 
          content: "I'm experiencing a momentary disconnect from the main intelligence node. Could you please repeat that?" 
        });
      }
    } finally {
      setIsLoading(false);
      setTyping(false);
    }
  };

  return {
    sendMessage,
    isLoading,
    isSyncing,
    error,
    messages,
    qualificationScore
  };
};