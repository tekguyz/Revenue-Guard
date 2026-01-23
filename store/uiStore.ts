
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ViewMode, SystemStatus, Theme } from '../types';

interface UIState {
  theme: Theme;
  isNavOpen: boolean;
  currentView: ViewMode;
  systemStatus: SystemStatus;
  hasRestoredSession: boolean;
  toggleTheme: () => void;
  setNavOpen: (isOpen: boolean) => void;
  setView: (view: ViewMode) => void;
  setSystemStatus: (status: SystemStatus) => void;
  setHasRestoredSession: (restored: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // REVENUE GUARD: Initializing with standard light theme for executive clarity
      theme: 'light',
      isNavOpen: false,
      currentView: 'strategist',
      systemStatus: 'optimal',
      hasRestoredSession: false,
      
      // Fix: Implementation of toggleTheme to sync store state with DOM classes for Tailwind
      toggleTheme: () => set((state) => {
        const nextTheme = state.theme === 'light' ? 'dark' : 'light';
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', nextTheme === 'dark');
        }
        return { theme: nextTheme };
      }),
      setNavOpen: (isOpen) => set({ isNavOpen: isOpen }),
      setView: (view) => set({ currentView: view, isNavOpen: false }),
      setSystemStatus: (status) => set({ systemStatus: status }),
      setHasRestoredSession: (restored) => set({ hasRestoredSession: restored }),
    }),
    {
      name: 'revenue-guard-ui-v2', // Updated key to clear old theme prefs
      storage: createJSONStorage(() => localStorage),
      // Fix: Handle persistence of theme mode during hydration to prevent style flashes
      onRehydrateStorage: () => (state) => {
        if (state && typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', state.theme === 'dark');
        }
      },
    }
  )
);
