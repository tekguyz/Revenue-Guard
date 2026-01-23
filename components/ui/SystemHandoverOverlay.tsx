import React, { useEffect, useRef, useState } from 'react';
import { Lock } from 'lucide-react';

interface SystemHandoverOverlayProps {
  onComplete: () => void;
}

/**
 * SystemHandoverOverlay
 * Implements the 'Digital Shred' transition.
 * Uses fixed positioning to isolate the animation from the document flow, preventing CLS.
 */
export const SystemHandoverOverlay: React.FC<SystemHandoverOverlayProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const sequence = async () => {
      // 1. Initial Reveal (Scan Down) using clip-path
      // clip-path animations on fixed elements do not trigger layout shifts
      if (containerRef.current) {
        containerRef.current.animate([
            { clipPath: 'inset(0 0 100% 0)' },
            { clipPath: 'inset(0 0 0 0)' }
        ], {
            duration: 800,
            easing: 'cubic-bezier(0.86, 0, 0.07, 1)',
            fill: 'forwards'
        });
      }

      // 2. Terminal Logs Simulation
      const messages = [
          "INITIATING SECURE HANDSHAKE...",
          "ENCRYPTING PAYLOAD [AES-256]...",
          "VERIFYING INTEGRITY HASH...",
          "DISPATCHING TO TEKGUYZ PRINCIPAL...",
          "CONNECTION SECURED."
      ];

      for (const msg of messages) {
          await new Promise(r => setTimeout(r, 400));
          setLogs(prev => [...prev, msg]);
      }

      // 3. Digital Shred Exit (Clip + Blur + Fade)
      await new Promise(r => setTimeout(r, 800));
      if (containerRef.current) {
         const exitAnim = containerRef.current.animate([
             { 
               opacity: 1, 
               filter: 'blur(0px)',
               clipPath: 'inset(0 0 0 0)' 
             },
             { 
               opacity: 0, 
               filter: 'blur(20px)',
               clipPath: 'inset(50% 0 50% 0)' // Digital "Shred" into center
             }
         ], {
             duration: 700,
             easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
             fill: 'forwards'
         });

         exitAnim.finished.then(() => {
             onComplete();
         });
      }
    };

    sequence();
  }, [onComplete]);

  return (
    <div 
        ref={containerRef}
        className="fixed inset-0 z-[100] bg-[#0A0A0B] flex flex-col items-center justify-center font-mono overflow-hidden"
        style={{ clipPath: 'inset(0 0 100% 0)' }} 
    >
        {/* Isolated Animation Layer: Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,35,102,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,35,102,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        <div className="relative z-10 flex flex-col items-center gap-6">
            <div className="w-20 h-20 bg-brand/20 rounded-full flex items-center justify-center animate-pulse border border-brand">
                <Lock className="w-10 h-10 text-brand" />
            </div>
            
            <h2 className="text-2xl font-bold tracking-widest text-white uppercase">System Handover</h2>
            
            <div ref={textRef} className="w-80 h-44 bg-black/50 border border-brand/30 rounded p-4 overflow-hidden text-[10px] flex flex-col justify-end shadow-2xl">
                {logs.map((log, i) => (
                    <div key={i} className="text-green-500 mb-1 flex items-start gap-2">
                        <span className="opacity-50 flex-shrink-0">{'>'}</span>
                        <span className="animate-in fade-in slide-in-from-left-1 duration-200">{log}</span>
                    </div>
                ))}
                <div className="w-2 h-4 bg-green-500 animate-pulse mt-1"></div>
            </div>
        </div>

        {/* GPU-Accelerated Scan Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-brand shadow-[0_0_20px_#3500D3] opacity-50 animate-[scan_3s_linear_infinite]"></div>
        
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes scan {
            0% { transform: translateY(-100vh); }
            100% { transform: translateY(100vh); }
          }
        `}} />
    </div>
  );
};