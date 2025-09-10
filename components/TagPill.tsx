import React from 'react';

interface TagPillProps {
  label: string;
  isSelected: boolean;
  onToggle: () => void;
}

const TagPill: React.FC<TagPillProps> = ({ label, isSelected, onToggle }) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={isSelected}
      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 border focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg focus-visible:ring-primary ${
        isSelected
          ? 'bg-primary border-primary text-primary-contrast'
          : 'bg-surface-2 border-border text-muted hover:bg-border hover:text-text'
      }`}
    >
      {label}
    </button>
  );
};

export default TagPill;
