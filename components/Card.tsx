
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  isHoverable?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', isHoverable = false }) => {
  // Fix: Added isHoverable prop to support hover effects on the card, resolving a type error.
  const hoverClasses = isHoverable ? 'transition-all duration-200 hover:shadow-lg hover:-translate-y-1' : '';

  return (
    <div className={`card rounded-xl p-6 md:p-7 ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
