import React from 'react';
import { useTechMotion } from '../animations/useTechMotion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  className = '',
  onClick,
  ...props
}) => {
  const { buttonPulse } = useTechMotion();

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (variant === 'primary' || variant === 'accent') {
      buttonPulse(e);
    }
  };

  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg";
  
  const variants = {
    primary: "bg-brand hover:bg-brand-hover text-white shadow-lg shadow-brand/20 border border-transparent",
    accent: "bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/20 border border-transparent",
    secondary: "bg-dark-card dark:bg-light-card text-dark-text dark:text-light-text border border-dark-border dark:border-light-border hover:bg-opacity-90",
    outline: "border-2 border-brand text-brand hover:bg-brand/10",
    ghost: "text-dark-muted dark:text-light-muted hover:text-brand hover:bg-brand/5",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-5 py-2.5 text-base gap-2",
    lg: "px-6 py-3.5 text-lg gap-2.5",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onMouseDown={handleMouseDown}
      onClick={onClick}
      {...props}
    >
      {icon && <span className="w-5 h-5">{icon}</span>}
      {children}
    </button>
  );
};