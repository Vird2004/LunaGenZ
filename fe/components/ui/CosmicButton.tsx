import { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface CosmicButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
}

export function CosmicButton({ children, className, variant = 'primary', ...props }: CosmicButtonProps) {
  const baseStyles = "relative overflow-hidden rounded-full font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 px-8 py-3 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-primary text-white shadow-[0_0_20px_rgba(45,27,78,0.8)] hover:shadow-[0_0_30px_rgba(45,27,78,1)] border border-accent/30",
    secondary: "bg-accent text-background shadow-[0_0_20px_rgba(255,215,0,0.4)] hover:shadow-[0_0_30px_rgba(255,215,0,0.6)]",
    outline: "bg-transparent text-accent border border-accent hover:bg-accent/10"
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
}
