import React from 'react';

interface TooltipProps {
  children: React.ReactElement;
  tip: string;
  position?: 'top' | 'bottom';
}

const Tooltip: React.FC<TooltipProps> = ({ children, tip, position = 'top' }) => {
  const positionClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
  };

  return (
    <div className="relative inline-flex group">
      {children}
      <div
        role="tooltip"
        className={`absolute ${positionClasses[position]} left-1/2 -translate-x-1/2 w-max max-w-xs p-2 text-sm text-primary-contrast bg-surface border border-border rounded-md shadow-lg 
                   invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100
                   transition-opacity duration-200 z-50`}
      >
        {tip}
      </div>
    </div>
  );
};

export default Tooltip;
