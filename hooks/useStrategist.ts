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

      // Extended Timeout (15s) for cold-starts/latency
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('TIMEOUT')), 15000)
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
        // Fix: Only trigger sanity check if we have data or if explicit qualification reached
        if (response.data.ready_for_phase_1) {
          
          // Data Integrity Verification (Only if hours provided > 0)
          if (leadData.estimatedWastedHours > 0) {
            const sanityCheck = LeadSanitySchema.safeParse({
               email: "verification@tekguyz.com", // Dummy for check
               staffCount: 1, // Dummy for check
               estimatedWastedHours: leadData.estimatedWastedHours,
               qualificationScore: response.data.score,
               scheduledTime: "placeholder" // Dummy for check
            });

            if (!sanityCheck.success) {
               // Genuine Anomaly Detected
               addMessage({
                  role: 'strategist',
                  content: "I've detected a significant data skew. Please verify the weekly wasted hours to ensure our ROI projections remain accurate for your scale."
               });
               setSystemStatus('latent');
            }
          }

          // Proceed with Sync
          setIsSyncing(true);
          try {
            const payload = {
                leadData: { 
                    ...leadData, 
                    qualificationScore: response.data.score,
                    bottleneck: response.data.bottleneck || "Unspecified",
                    company: response.data.company || "Unspecified"
                },
                transcript: messages.concat([
                  { role: 'user', content, timestamp: Date.now() }, 
                  { role: 'strategist', content: response.text, timestamp: Date.now() }
                ]),
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

      // Add AI Message
      addMessage({ role: 'strategist', content: response.text });

    } catch (err: any) {
      if (err.message === 'TIMEOUT') {
        setSystemStatus('latent');
        addMessage({
            role: 'strategist',
            content: "The intelligence link is currently under heavy load. I've enabled the manual brief below so we can keep building your ROI model without interruption."
        });
        setQualification(7); 
      } else {
        setSystemStatus('disconnected');
        setError("Strategist Offline");
        addMessage({ 
          role: 'strategist', 
          content: "I've lost sync with the primary node. Please re-state your last point while I attempt a reconnect." 
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