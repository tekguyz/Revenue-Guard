import React from 'react';
import { useUIStore } from '../../store/uiStore';

interface RGLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export const RGLogo: React.FC<RGLogoProps> = ({ size = 32, className = '', showText = false }) => {
  const { theme } = useUIStore();
  const isDark = theme === 'dark';
  
  // Electric Purple for Dark Mode, Deep Royal Blue for Light Mode
  const primaryColor = isDark ? '#8b5cf6' : '#002366';
  const secondaryColor = '#3500D3'; // Deep Purple for accents

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Revenue Guard Logo"
        className="transition-colors duration-300"
      >
        {/* Shield Outer Frame / Terminal Brackets Hybrid */}
        <path 
          d="M20 2L4 10v10c0 10 16 18 16 18s16-8 16-18V10L20 2z" 
          stroke={primaryColor} 
          strokeWidth="3" 
          strokeLinejoin="round" 
        />
        
        {/* Geometric 'R' inner shape */}
        <path 
          d="M15 15h10v5h-7l7 10" 
          stroke={secondaryColor} 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        
        {/* Scanning Accent Point */}
        <circle cx="20" cy="10" r="1.5" fill={primaryColor} className="animate-pulse" />
      </svg>
      
      {showText && (
        <span className="font-bold text-xl tracking-tight text-light-text dark:text-dark-text whitespace-nowrap">
          Revenue<span className="text-accent">Guard</span>
        </span>
      )}
    </div>
  );
};