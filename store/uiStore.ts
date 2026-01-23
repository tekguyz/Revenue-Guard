import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UIState } from '../types';

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'dark', // Default to dark mode for high-tech feel
      isNavOpen: false,
      currentView: 'strategist',
      systemStatus: 'optimal',
      hasRestoredSession: false,
      
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      setNavOpen: (isOpen) => set({ isNavOpen: isOpen }),
      setView: (view) => set({ currentView: view, isNavOpen: false }),
      setSystemStatus: (status) => set({ systemStatus: status }),
      setHasRestoredSession: (restored) => set({ hasRestoredSession: restored }),
    }),
    {
      name: 'revenue-guard-ui',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
          if (state) {
              state.setHasRestoredSession(true);
              // Auto-reset restoration flag after notification would be handled in the component
          }
      }
    }
  )
);