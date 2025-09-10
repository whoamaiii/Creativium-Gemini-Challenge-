import React from 'react';
import { ChevronDown } from './icons';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ label, id, children, className = '', ...props }) => {
  return (
    <div className={`w-full ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium text-muted mb-2">{label}</label>
      <div className="relative">
        <select
          id={id}
          className="select w-full appearance-none pr-10"
          {...props}
        >
          {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted">
          <ChevronDown size={20} />
        </div>
      </div>
    </div>
  );
};

export default Select;
