import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { InteractionState } from '../types';

const initialState = {
  messages: [
    {
      role: 'strategist' as const,
      content: "Welcome to Revenue Guard. I'm your AI Strategist. I help teams identify 'Manual Work Fatigue' and recover lost revenue. To begin, could you tell me a bit about your current role and the biggest operational bottleneck you're facing?",
      timestamp: Date.now(),
    },
  ],
  isTyping: false,
  qualificationScore: 0,
  leadData: {
    company: '',
    bottleneck: '',
    estimatedWastedHours: 0,
  },
};

export const useInteractionStore = create<InteractionState>()(
  persist(
    (set) => ({
      ...initialState,
      addMessage: (msg) =>
        set((state) => ({
          messages: [
            ...state.messages,
            { ...msg, timestamp: Date.now() },
          ],
        })),
      setTyping: (isTyping) => set({ isTyping }),
      setQualification: (score) => set({ qualificationScore: score }),
      updateLeadData: (data) =>
        set((state) => ({
          leadData: { ...state.leadData, ...data },
        })),
      reset: () => set({ ...initialState, messages: [{ ...initialState.messages[0], timestamp: Date.now() }] })
    }),
    {
      name: 'revenue-guard-interaction',
      storage: createJSONStorage(() => localStorage), // Switched to localStorage for persistence
    }
  )
);