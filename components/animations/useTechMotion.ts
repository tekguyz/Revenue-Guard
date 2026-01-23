import React, { useCallback } from 'react';

export const useTechMotion = () => {
  
  const buttonPulse = useCallback((e: React.MouseEvent<HTMLElement> | HTMLElement) => {
    const target = (e instanceof HTMLElement ? e : e.currentTarget) as HTMLElement;
    target.animate([
      { transform: 'scale(1)' },
      { transform: 'scale(0.97)' },
      { transform: 'scale(1)' }
    ], {
      duration: 200,
      easing: 'ease-out'
    });
  }, []);

  const strategistEntry = useCallback((element: HTMLElement) => {
    if (!element) return;
    element.animate([
      { opacity: 0, transform: 'translateY(10px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], {
      duration: 500,
      easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Elastic overshoot
      fill: 'forwards'
    });
  }, []);

  const staggeredReveal = useCallback((elements: HTMLElement[]) => {
    elements.forEach((el, i) => {
      if (!el) return;
      el.animate([
        { opacity: 0, clipPath: 'inset(100% 0 0 0)', transform: 'translateY(10px)' },
        { opacity: 1, clipPath: 'inset(0 0 0 0)', transform: 'translateY(0)' }
      ], {
        duration: 400,
        delay: i * 40,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        fill: 'forwards'
      });
    });
  }, []);

  return { buttonPulse, strategistEntry, staggeredReveal };
};