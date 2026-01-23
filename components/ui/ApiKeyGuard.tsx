
import React, { useState, useEffect } from 'react';
import { ShieldAlert, Key, ExternalLink, Cpu } from 'lucide-react';
import { Button } from './Button';
import { RGLogo } from './RGLogo';

interface ApiKeyGuardProps {
  children: React.ReactNode;
}

// Fixed: Properly augment global scope by defining the AIStudio interface 
// and using the name the compiler expects for the window.aistudio property.
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    // Modified to be optional (?) to match existing declarations in the environment 
    // and resolve the "All declarations of 'aistudio' must have identical modifiers" error.
    aistudio?: AIStudio;
  }
}

export const ApiKeyGuard: React.FC<ApiKeyGuardProps> = ({ children }) => {
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  useEffect(() => {
    const checkKey = async () => {
      // Priority 1: Check standard env var (usually provided by runtime injection)
      const currentKey = process.env.API_KEY || (window as any).process?.env?.API_KEY;
      if (currentKey) {
        setHasKey(true);
        return;
      }

      // Priority 2: Check for AI Studio environment bridge
      if (window.aistudio) {
        try {
          const selected = await window.aistudio.hasSelectedApiKey();
          setHasKey(selected);
        } catch (e) {
          console.error("ApiKeyGuard: selection check failed", e);
          setHasKey(false);
        }
      } else {
        // No bridge and no env var = fail
        setHasKey(false);
      }
    };
    checkKey();
  }, []);

  const handleAuthorize = async () => {
    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        // Mandatory: Assume success to bypass race conditions where hasSelectedApiKey() 
        // doesn't update immediately after the dialog closes.
        setHasKey(true);
      } catch (e) {
        console.error("ApiKeyGuard: authorization failed", e);
      }
    }
  };

  if (hasKey === null) return null; // Initializing state

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
