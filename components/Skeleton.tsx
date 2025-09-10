import React from 'react';

const Skeleton: React.FC<{ className?: string }> = ({ className = 'h-4' }) => {
  return (
    <div className={`bg-surface-2 rounded motion-safe:animate-pulse ${className}`} />
  );
};

export default Skeleton;
