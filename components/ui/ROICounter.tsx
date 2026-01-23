import React, { useEffect, useRef, useState } from 'react';

interface ROICounterProps {
  value: number;
}

export const ROICounter: React.FC<ROICounterProps> = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const requestRef = useRef<number>(null);
  const startTimeRef = useRef<number | null>(null);
  const startValueRef = useRef(0);
  const duration = 1500; // 1.5s roll time

  useEffect(() => {
    startValueRef.current = displayValue;
    startTimeRef.current = null;
    
    const animate = (time: number) => {
      if (startTimeRef.current === null) startTimeRef.current = time;
      const progress = Math.min((time - startTimeRef.current) / duration, 1);
      
      // Easing: easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const current = Math.floor(startValueRef.current + (value - startValueRef.current) * ease);
      setDisplayValue(current);

      if (progress < 1) {
        requestRef.current = requestAnimationFrame(animate);
      }
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
        if(requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [value]);

  // Dynamic glow calculation based on value (max glow at $1M)
  const glowIntensity = Math.min(displayValue / 1000000, 1);
  const textShadow = `0 0 ${10 + glowIntensity * 20}px rgba(53, 0, 211, ${0.2 + glowIntensity * 0.5})`;

  return (
    <div 
        className="text-4xl font-bold text-accent transition-all duration-300"
        style={{ textShadow }}
    >
      ${displayValue.toLocaleString()}
      <span className="text-lg text-light-muted dark:text-dark-muted font-medium ml-1">/yr</span>
    </div>
  );
};