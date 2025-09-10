import React from 'react';

type BadgeColor = 'blue' | 'green' | 'gray' | 'yellow';

interface BadgeProps {
  children: React.ReactNode;
  color?: BadgeColor;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, color = 'gray', className = '' }) => {
  const colors: Record<BadgeColor, string> = {
    blue: 'bg-primary/10 text-primary',
    green: 'bg-success/10 text-success',
    gray: 'bg-surface-2 text-muted',
    yellow: 'bg-warn/10 text-warn',
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full ${colors[color]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
