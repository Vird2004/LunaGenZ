import { ReactNode, HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
  return (
    <div 
      className={cn("glass p-6 rounded-2xl transition-all duration-300", className)}
      {...props}
    >
      {children}
    </div>
  );
}
