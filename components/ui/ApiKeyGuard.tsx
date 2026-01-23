import React, { useState, useEffect } from 'react';
import { ShieldAlert, Key, ExternalLink, Cpu } from 'lucide-react';
import { Button } from './Button';
import { RGLogo } from './RGLogo';

interface ApiKeyGuardProps {
  children: React.ReactNode;
}

declare global {
  /**
   * AIStudio Interface
   * Defined to match the ambient type expected by the environment.
   */
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    // Fixed: Aligned with environment-provided AIStudio type to resolve declaration conflicts.
    // This property is already declared as 'AIStudio' in the global scope.
    aistudio: AIStudio;
  }
}

export const ApiKeyGuard: React.FC<ApiKeyGuardProps> = ({ children }) => {
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  useEffect(() => {
    const checkKey = async () => {
      // Check if we are in an environment that supports selection
      if (window.aistudio) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      } else {
        // Fallback for standard environments using process.env.API_KEY
        setHasKey(!!process.env.API_KEY);
      }
    };
    checkKey();
  }, []);

  const handleAuthorize = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // Per instructions, assume success after triggering dialog to avoid race conditions
      setHasKey(true);
    }
  };

  if (hasKey === null) return null; // Initializing check

  if (!hasKey) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full glass-panel border border-dark-border rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          {/* Animated Background Accents */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <RGLogo size={64} className="mb-8" />
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-mono mb-6 uppercase tracking-widest">
              <ShieldAlert className="w-3.5 h-3.5" />
              Intelligence Link Offline
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-4">Authorize Strategist</h1>
            <p className="text-dark-muted mb-8 leading-relaxed">
              Revenue Guard requires a secure connection to the Gemini Intelligence Core. Please select a project with active billing to initialize the Strategist.
            </p>

            <div className="w-full space-y-4">
              <Button 
                onClick={handleAuthorize} 
                className="w-full py-6 text-lg"
                variant="accent"
                icon={<Key className="w-5 h-5" />}
              >
                Connect Intelligence
              </Button>
              
              <a 
                href="https://ai.google.dev/gemini-api/docs/billing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-sm text-brand-light hover:text-white transition-colors group"
              >
                <span>Review Billing Documentation</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100" />
              </a>
            </div>

            <div className="mt-12 flex items-center gap-4 opacity-30 grayscale">
              <div className="h-[1px] flex-grow bg-dark-border"></div>
              <Cpu className="w-4 h-4 text-dark-muted" />
              <div className="h-[1px] flex-grow bg-dark-border"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};