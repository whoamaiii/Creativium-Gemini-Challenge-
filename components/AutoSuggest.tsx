import React, { useState, useEffect, useRef } from 'react';

// Fix: Use Omit to exclude the conflicting `onSelect` from the standard input attributes.
interface AutoSuggestProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onSelect'> {
  label: string;
  id: string;
  suggestions: string[];
  onSelect: (value: string) => void;
}

const AutoSuggest: React.FC<AutoSuggestProps> = ({
  label,
  id,
  suggestions,
  value,
  onChange,
  onSelect,
  ...props
}) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userInput = e.currentTarget.value;
    const filtered = suggestions.filter(
      suggestion => suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );
    setFilteredSuggestions(filtered);
    setShowSuggestions(true);
    if (onChange) {
      onChange(e);
    }
  };

  const handleSelect = (suggestion: string) => {
    onSelect(suggestion);
    setFilteredSuggestions([]);
    setShowSuggestions(false);
  };

  const show = showSuggestions && value && filteredSuggestions.length > 0;

  return (
    <div className="w-full relative" ref={containerRef}>
      <label htmlFor={id} className="block text-sm font-medium text-muted mb-2">{label}</label>
      <input
        id={id}
        className="input"
        type="text"
        value={value}
        onChange={handleChange}
        onFocus={() => setShowSuggestions(true)}
        autoComplete="off"
        {...props}
      />
      {show && (
        <ul className="absolute z-10 w-full mt-1 bg-surface border border-border rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={suggestion + index}
              onClick={() => handleSelect(suggestion)}
              className="cursor-pointer select-none relative py-2 px-4 text-text hover:bg-surface-2"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutoSuggest;
