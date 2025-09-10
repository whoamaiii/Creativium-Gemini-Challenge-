// Fix: Create the Chip component. This file was missing content, causing an import error.
import React from 'react';

interface ChipProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

const Chip: React.FC<ChipProps> = ({ label, isSelected, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSelected}
      className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 border focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:ring-primary ${
        isSelected
          ? 'bg-primary border-primary text-primary-contrast'
          : 'bg-surface border-border text-muted hover:bg-border hover:text-text'
      }`}
    >
      {label}
    </button>
  );
};

export default Chip;
