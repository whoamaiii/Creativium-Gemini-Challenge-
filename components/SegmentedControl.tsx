import React from 'react';

interface SegmentedControlProps<T extends string> {
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
}

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label
}: SegmentedControlProps<T>) {
  return (
    <div>
      <label className="block text-sm font-medium text-muted mb-2">{label}</label>
      <div className="flex w-full bg-surface-2 rounded-lg p-1">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              value === option.value
                ? 'bg-primary text-primary-contrast shadow-sm'
                : 'text-muted hover:bg-surface'
            }`}
            aria-pressed={value === option.value}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SegmentedControl;
