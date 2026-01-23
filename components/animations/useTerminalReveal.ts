import { useEffect, useRef, RefObject } from 'react';

interface UseTerminalRevealOptions {
  delay?: number;
  staggerIndex?: number;
  threshold?: number;
  once?: boolean;
}

/**
 * useTerminalReveal
 * GPU-Accelerated entry animation using Native Web Animations API (WAAPI).
 * Optimized for staggered lists without external library overhead.
 */
export const useTerminalReveal = (
  ref: RefObject<HTMLElement | null>,
  options: UseTerminalRevealOptions = {}
) => {
  const { 
    delay = 0, 
    staggerIndex = 0, 
    threshold = 0.1,
    once = true 
  } = options;
  
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Set initial state: Invisible and offset
    // Using opacity and transform to stay on the compositor thread
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.willChange = 'opacity, transform';

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && (!once || !hasAnimated.current)) {
            hasAnimated.current = true;
            
            // Stagger calculation: 60ms gap per index as per spec
            const totalDelay = delay + (staggerIndex * 60);

            // Native WAAPI implementation
            const animation = element.animate(
              [
                { 
                  opacity: 0, 
                  transform: 'translateY(20px)',
                  easing: 'cubic-bezier(0.22, 1, 0.36, 1)' 
                },
                { 
                  opacity: 1, 
                  transform: 'translateY(0)',
                  easing: 'cubic-bezier(0.22, 1, 0.36, 1)' 
                }
              ],
              {
                duration: 800, // Slightly longer for smoother "strategic" feel
                fill: 'forwards',
                delay: totalDelay,
              }
            );

            // Commit final styles to avoid jumps after animation ends
            animation.finished.then(() => {
              element.style.opacity = '1';
              element.style.transform = 'translateY(0)';
              element.style.willChange = 'auto';
            });

            if (once) observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before it hits the viewport
      }
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [ref, delay, staggerIndex, threshold, once]);
};