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

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('TIMEOUT')), 15000)
      );

      const response = await Promise.race([
        generateStrategistResponse(history),
        timeoutPromise
      ]) as Awaited<ReturnType<typeof generateStrategistResponse>>;

      // Strategic Fallback: Ensure we never display a blank bubble
      const finalContent = response.text?.trim() || "I'm processing that information. Can you tell me a bit more about how this specific friction point impacts your team's daily output?";

      if (response.data) {
        setQualification(response.data.score);
        
        if (response.data.bottleneck) {
          updateLeadData({ bottleneck: response.data.bottleneck });
        }
        if (response.data.company) {
            updateLeadData({ company: response.data.company });
        }

        if (response.data.ready_for_phase_1) {
          if (leadData.estimatedWastedHours > 0) {
            const sanityCheck = LeadSanitySchema.safeParse({
               email: "verification@tekguyz.com",
               staffCount: 1,
               estimatedWastedHours: leadData.estimatedWastedHours,
               qualificationScore: response.data.score,
               scheduledTime: "placeholder"
            });

            if (!sanityCheck.success) {
               addMessage({
                  role: 'strategist',
                  content: "I've detected a significant data skew in the reported metrics. Please verify the weekly wasted hours so we can maintain absolute accuracy in your ROI model."
               });
               setSystemStatus('latent');
            }
          }

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
                  { role: 'strategist', content: finalContent, timestamp: Date.now() }
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

      addMessage({ role: 'strategist', content: finalContent });

    } catch (err: any) {
      if (err.message === 'TIMEOUT') {
        setSystemStatus('latent');
        addMessage({
            role: 'strategist',
            content: "The primary intelligence link is under heavy load. I've enabled the Strategic Brief protocol below so we can continue your ROI mapping without delay."
        });
        setQualification(7); 
      } else {
        setSystemStatus('disconnected');
        setError("Strategist Offline");
        addMessage({ 
          role: 'strategist', 
          content: "I've lost synchronization with the primary node. Please re-state your last point while I re-initialize the link." 
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