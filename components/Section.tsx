import React from 'react';
import Card from './Card';

interface SectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ title, children, className = '' }) => {
  return (
    <Card className={`w-full ${className}`}>
      <h2 className="text-xl font-semibold mb-4 text-text">{title}</h2>
      <div className="text-text">{children}</div>
    </Card>
  );
};

export default Section;