export type Theme = 'light' | 'dark';

export type ViewMode = 'strategist' | 'assessment' | 'dashboard';

export type SystemStatus = 'optimal' | 'latent' | 'disconnected';

export interface UIState {
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

export interface BriefFormData {
  bottlenecks: string[];
  goals: string;
  staffCount: number;
  hoursWasted: number;
  email: string;
}

export interface LeadState {
  sessionId: string | null;
  startedAt: number | null;
  brief: BriefFormData;
  formStep: number;
  isSubmitting: boolean;
  calculatedROI: number;
  
  startSession: () => void;
  setBriefData: (data: Partial<BriefFormData>) => void;
  setFormStep: (step: number) => void;
  setSubmitting: (isSubmitting: boolean) => void;
  calculateROI: () => void;
  reset: () => void;
}

export type MessageRole = 'strategist' | 'user';

export interface Message {
  role: MessageRole;
  content: string;
  timestamp: number;
}

export interface LeadData {
  company: string;
  bottleneck: string;
  estimatedWastedHours: number;
}

export interface InteractionState {
  messages: Message[];
  isTyping: boolean;
  qualificationScore: number; // 0-10
  leadData: LeadData;
  addMessage: (msg: { role: MessageRole; content: string }) => void;
  setTyping: (isTyping: boolean) => void;
  setQualification: (score: number) => void;
  updateLeadData: (data: Partial<LeadData>) => void;
  reset: () => void;
}