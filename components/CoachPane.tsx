import React, { useState, useMemo } from 'react';
import { AIAnalysis } from '../types';
import { getCoachSuggestion } from '../services/coach';
import { copyText } from '../utils/clipboard';
import { toastService } from '../services/toast';
import Button from './Button';
import { Lightbulb } from './icons';

interface CoachPaneProps {
  analysis: AIAnalysis | null;
}

const CoachPane: React.FC<CoachPaneProps> = ({ analysis }) => {
  const [history, setHistory] = useState<string[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState('');

  const initialSuggestion = useMemo(() => getCoachSuggestion('', analysis), [analysis]);

  const handleAsk = () => {
    if (!analysis) return;
    const suggestion = getCoachSuggestion(currentPrompt, analysis);
    setHistory(prev => [...prev, `You asked: ${currentPrompt}`, `Coach: ${suggestion}`]);
    setCurrentPrompt('');
  };
  
  const allNotes = useMemo(() => {
    return [
      `Coach: ${initialSuggestion}`,
      ...history
    ].join('\n\n');
  }, [initialSuggestion, history]);

  const handleCopy = async () => {
    if (await copyText(allNotes)) {
      toastService.show("Coach notes copied!");
    } else {
      toastService.show("Failed to copy notes.");
    }
  };

  return (
    <div className="flex flex-col h-[70vh]">
      <div className="flex-grow p-4 space-y-4 overflow-y-auto bg-surface-2 rounded-t-lg">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-brand rounded-full text-primary-contrast shrink-0">
            <Lightbulb size={20} />
          </div>
          <div className="bg-surface border border-border p-4 rounded-lg rounded-tl-none">
            <p className="font-semibold text-brand mb-2">Here's a starting point:</p>
            <div className="prose prose-sm max-w-none text-text prose-strong:text-text whitespace-pre-wrap">
              {initialSuggestion}
            </div>
          </div>
        </div>
        {/* Mock history would render here if the feature were expanded */}
      </div>
      <div className="border-t border-border p-4 space-y-2">
        <textarea
          className="textarea w-full text-sm"
          placeholder="Ask a follow-up question... (feature coming soon)"
          value={currentPrompt}
          onChange={(e) => setCurrentPrompt(e.target.value)}
          rows={2}
          disabled
        />
        <Button onClick={handleCopy} className="w-full" variant="primary">Copy All Notes</Button>
      </div>
    </div>
  );
};

export default CoachPane;