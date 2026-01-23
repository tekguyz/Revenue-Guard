import React, { useEffect, useRef } from 'react';
import { RGLogo } from './RGLogo';

export const TerminalLoader: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const chars = '0123456789ABCDEF';
    const fontSize = 14;
    
    // Resize handler
    const resize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const columns = Math.ceil(canvas.width / fontSize);
    const drops = new Array(columns).fill(0).map(() => Math.random() * -100); // Start above canvas

    const draw = () => {
      // Semi-transparent fade for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00FF41'; // Terminal Green
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(text, x, y);

        // Random reset to top
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={`relative overflow-hidden bg-black/90 rounded-xl border border-dark-border ${className}`}>
        <canvas ref={canvasRef} className="w-full h-full opacity-30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="animate-pulse">
                <RGLogo size={48} />
            </div>
            <div className="bg-black/80 backdrop-blur-sm border border-green-500/30 px-4 py-2 rounded-lg shadow-2xl shadow-green-500/10">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                    <span className="text-green-500 font-mono text-sm tracking-widest">PHASE_1_SYNC_IN_PROGRESS</span>
                </div>
            </div>
        </div>
    </div>
  );
};