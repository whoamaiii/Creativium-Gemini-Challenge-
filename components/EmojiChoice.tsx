import React from 'react';
import type { Emotion } from '../types';
import { EMOTIONS_WITH_EMOJI } from '../constants';

interface EmojiChoiceProps {
  selected: Emotion[];
  onChange: (selected: Emotion[]) => void;
}

const EmojiChoice: React.FC<EmojiChoiceProps> = ({ selected, onChange }) => {

  const handleToggle = (key: Emotion) => {
    const newSelected = selected.includes(key)
      ? selected.filter(e => e !== key)
      : [...selected, key];
    onChange(newSelected);
  };

  return (
    <div className="flex flex-wrap justify-around gap-2">
      {EMOTIONS_WITH_EMOJI.map(({ key, emoji, label }) => {
        const isSelected = selected.includes(key);
        return (
          <button
            key={key}
            type="button"
            onClick={() => handleToggle(key)}
            aria-pressed={isSelected}
            className={`flex flex-col items-center gap-2 p-3 rounded-lg w-20 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              isSelected ? 'bg-primary/20' : 'hover:bg-surface-2'
            }`}
          >
            <span className={`text-4xl transition-transform duration-200 ${isSelected ? 'scale-110' : ''}`}>{emoji}</span>
            <span className={`text-xs font-semibold ${isSelected ? 'text-primary' : 'text-muted'}`}>{label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default EmojiChoice;
