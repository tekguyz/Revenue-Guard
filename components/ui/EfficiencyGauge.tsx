import React, { useEffect, useRef } from 'react';

interface EfficiencyGaugeProps {
  score: number; // 0-10
}

export const EfficiencyGauge: React.FC<EfficiencyGaugeProps> = ({ score }) => {
  const circleRef = useRef<SVGCircleElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 10) * circumference;

  useEffect(() => {
    if (circleRef.current && textRef.current) {
      // Animate Progress
      circleRef.current.animate([
        { strokeDashoffset: circumference },
        { strokeDashoffset: offset }
      ], {
        duration: 1500,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'forwards'
      });

      // Animate Text Count-up
      const duration = 1500;
      const start = 0;
      const end = score;
      const startTime = performance.now();

      const animateText = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3); // Cubic out
        
        const currentScore = Math.floor(start + (end - start) * ease);
        if (textRef.current) {
          textRef.current.textContent = currentScore.toString();
        }

        if (progress < 1) {
          requestAnimationFrame(animateText);
        }
      };
      
      requestAnimationFrame(animateText);
    }
  }, [score, circumference, offset]);

  const getColor = () => {
    if (score >= 8) return '#10B981'; // Green
    if (score >= 5) return '#EAB308'; // Yellow
    return '#EF4444'; // Red
  };

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="64"
          cy="64"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-light-border dark:text-dark-border"
        />
        <circle
          ref={circleRef}
          cx="64"
          cy="64"
          r={radius}
          stroke={getColor()}
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-light-text dark:text-dark-text font-mono">
            <span ref={textRef as any}>0</span>
            <span className="text-sm text-light-muted dark:text-dark-muted">/10</span>
        </span>
      </div>
    </div>
  );
};