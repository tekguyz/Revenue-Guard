import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { LeadState } from '../types';

interface ExtendedLeadState extends LeadState {
  auditComplete: boolean;
  setAuditComplete: (complete: boolean) => void;
}

const initialState = {
  sessionId: null,
  startedAt: null,
  brief: {
    bottlenecks: [],
    goals: '',
    staffCount: 0,
    hoursWasted: 0,
    email: '',
  },
  formStep: 1,
  isSubmitting: false,
  calculatedROI: 0,
  auditComplete: false,
};

export const useLeadStore = create<ExtendedLeadState>()(
  persist(
    (set, get) => ({
      ...initialState,

      startSession: () => set({ sessionId: crypto.randomUUID(), startedAt: Date.now() }),

      setBriefData: (data) => {
        set((state) => ({ brief: { ...state.brief, ...data } }));
        get().calculateROI();
      },

      setFormStep: (step) => set({ formStep: step }),

      setSubmitting: (isSubmitting) => set({ isSubmitting }),

      calculateROI: () => {
        const { staffCount, hoursWasted } = get().brief;
        const hourlyRate = 65; // Blended corporate rate
        const annualHours = hoursWasted * staffCount * 52;
        const savings = annualHours * hourlyRate * 0.70;
        
        set({ calculatedROI: Math.floor(savings) });
      },
      
      setAuditComplete: (complete) => set({ auditComplete: complete }),
      
      reset: () => set(initialState)
    }),
    {
      name: 'revenue-guard-lead',
      storage: createJSONStorage(() => localStorage),
    }
  )
);