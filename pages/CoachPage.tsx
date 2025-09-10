
import React, { useMemo, useState, useEffect } from 'react';
import { parseHashSearch } from '../utils/hashParams';
import { getAnalysis, getLatestSession, getSession } from '../services/store';
import { AIAnalysis } from '../types';

import Card from '../components/Card';
import Button from '../components/Button';
import { toastService } from '../services/toast';
// Fix: Correct the import path for the `copyText` utility.
import { copyText } from '../utils/clipboard';
import { BrainCircuit, Lightbulb } from '../components/icons';

const synthesizeCoachTip = (analysis: AIAnalysis | null | undefined): string => {
    if (!analysis) {
        return "I don't have enough data to provide a tip yet. Please analyze a session first.";
    }

    const { triggers, recommendations } = analysis;
    const mainTrigger = triggers.length > 0 ? triggers.sort((a,b) => b.confidence - a.confidence)[0].label : null;
    const proactiveRec = recommendations.proactive[0] ?? "develop a proactive strategy";
    const reactiveRec = recommendations.reactive[0] ?? "plan a reactive response";

    let tip = `Based on the latest analysis, a key area to focus on is managing reactions to **${mainTrigger || 'identified triggers'}**. \n\n`;
    tip += `**Proactively**, you could try to **${proactiveRec.toLowerCase()}**. `;
    tip += `When a challenging behavior occurs, a helpful **reactive** step might be to **${reactiveRec.toLowerCase()}**.`;
    tip += `\n\nRemember to stay consistent and observe how these strategies work over time.`;

    return tip;
};


const CoachPage: React.FC = () => {
    const qs = parseHashSearch();
    const sessionId = qs.get('id') || getLatestSession()?.id || '';

    const [session, setSession] = useState(getSession(sessionId));
    const [analysis, setAnalysis] = useState(getAnalysis(sessionId));
    
    useEffect(() => {
        setSession(getSession(sessionId));
        setAnalysis(getAnalysis(sessionId));
    }, [sessionId]);

    const coachTip = useMemo(() => synthesizeCoachTip(analysis), [analysis]);

    const handleCopy = () => {
        copyText(coachTip).then(ok => {
            if (ok) toastService.show("Coach notes copied!");
        });
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold">AI Coach</h1>
                <p className="text-muted mt-2">Get concise, actionable tips based on the latest session analysis.</p>
            </div>

            <Card>
                <div className="flex flex-col h-96">
                    <div className="flex-grow p-4 space-y-4 overflow-y-auto bg-surface-2 rounded-t-lg">
                        {/* Mock chat message from AI */}
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-brand rounded-full text-primary-contrast">
                                <Lightbulb size={20} />
                            </div>
                            <div className="bg-surface border border-border p-4 rounded-lg rounded-tl-none">
                                <p className="font-semibold text-brand mb-2">Here's a tip:</p>
                                {analysis ? (
                                    <div className="prose prose-sm max-w-none text-text prose-strong:text-text whitespace-pre-wrap">
                                        {coachTip}
                                    </div>
                                ) : (
                                     <div className="text-center py-8 text-muted">
                                        <BrainCircuit size={40} className="mx-auto mb-4" />
                                        <p className="mb-4">No analysis found for the selected session.</p>
                                        <a href={`#/insights?id=${sessionId}`}>
                                            <Button variant="secondary">Analyze Session</Button>
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-border p-4">
                        <Button variant="primary" onClick={handleCopy} className="w-full" disabled={!analysis}>
                            Copy Notes
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default CoachPage;
