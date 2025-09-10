import React, { useMemo, useState, useEffect } from 'react';
import { parseHashSearch } from '../utils/hashParams';
import { getSession, getAnalysis, getLatestSession, saveAnalysis } from '../services/store';
import { useStore } from '../services/store';
import { api } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import ConfidenceBar from '../components/ConfidenceBar';
import { toastService } from '../services/toast';
import Section from '../components/Section';
import Skeleton from '../components/Skeleton';
import Modal from '../components/Modal';
import { Attachment } from '../types';
import ExportToolbar from '../components/ExportToolbar';
import CoachPane from '../components/CoachPane';
import { Lightbulb, Target } from '../components/icons';
import Breadcrumbs from '../components/Breadcrumbs';

export default function InsightsPage() {
  const qs = parseHashSearch();
  const id = useMemo(() => qs.get('id') || getLatestSession()?.id || '', [qs]);
  
  const [session, setSession] = useState(() => id ? getSession(id) : null);
  const [analysis, setAnalysis] = useState(() => id ? getAnalysis(id) : undefined);
  const [isBusy, setIsBusy] = useState(false);
  
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [isCoachOpen, setIsCoachOpen] = useState(false);

  const { addGoal, goals } = useStore();

  useEffect(() => {
    const newSession = id ? getSession(id) : null;
    const newAnalysis = id ? getAnalysis(id) : undefined;
    setSession(newSession);
    setAnalysis(newAnalysis);

    // If session exists but analysis doesn't, automatically run it.
    if (newSession && !newAnalysis && !isBusy) {
      runAnalysis(newSession);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const isGoalTracked = useMemo(() => {
    if (!session) return false;
    return goals.some(g => g.originSessionId === session.id);
  }, [session, goals]);

  const fullSummaryText = useMemo(() => {
    if (!session || !analysis) return '';
    return [
      `Insight Summary for ${session.student}`,
      `Date: ${new Date(session.timeISO).toLocaleString()}`,
      `\n--- SUMMARY ---\n${analysis.summary}`,
      `\n--- KEY FINDINGS ---\n- ${analysis.keyFindings.join('\n- ')}`,
      `\n--- SUGGESTED GOAL ---\n${analysis.suggestedGoal.statement} (Timeframe: ${analysis.suggestedGoal.timeframeWeeks} weeks)`,
    ].join('\n');
  }, [session, analysis]);

  const imageAttachments = useMemo(() => session?.attachments?.filter(a => a.kind === 'image') || [], [session]);

  const runAnalysis = async (sessionToAnalyze: typeof session) => {
    if (!sessionToAnalyze) return;
    setIsBusy(true);
    try {
      const res = await api.analyzeSession(sessionToAnalyze);
      saveAnalysis(sessionToAnalyze.id, res);
      setAnalysis(res);
      toastService.show('Analysis complete!');
    } catch (e) {
      toastService.show('Failed to run analysis.');
    } finally {
      setIsBusy(false);
    }
  };
  
  const handleTrackGoal = () => {
    if (!analysis || !session) return;
    addGoal({
      studentName: session.student,
      statement: analysis.suggestedGoal.statement,
      timeframeWeeks: analysis.suggestedGoal.timeframeWeeks,
      originSessionId: session.id,
    });
    toastService.show("Goal added to tracker!");
  };

  const openImageViewer = (index: number) => {
    setViewerIndex(index);
    setIsViewerOpen(true);
  };
  
  const changeImageViewer = (delta: number) => {
    const newIndex = (viewerIndex + delta + imageAttachments.length) % imageAttachments.length;
    setViewerIndex(newIndex);
  };

  if (!id || !session) {
    return (
      <Card className="text-center p-8">
        <h1 className="text-xl font-bold mb-2">Insights</h1>
        <p className="text-muted">No session selected or found.</p>
        <a className="text-brand underline mt-4 inline-block" href="#/">Track a New Session</a>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Breadcrumbs items={[{ label: 'Home', href: '#/' }, { label: 'Sessions', href: '#/sessions' }, { label: 'Insights' }]} />
          <h1 className="text-3xl font-bold mt-2">Session Insights</h1>
          <p className="text-muted">For {session.student} on {new Date(session.timeISO).toLocaleDateString()}</p>
        </div>
        <div className="flex gap-2">
          {analysis && <ExportToolbar sessionId={id} summaryText={fullSummaryText} />}
          {session && (
            <a href={`#/edit?id=${session.id}`}>
              <Button variant="secondary">Edit Session</Button>
            </a>
          )}
        </div>
      </div>
      
      {isBusy && !analysis && (
        <Card className="space-y-4 p-6">
           <Skeleton className="h-8 w-1/3" />
           <Skeleton className="h-4 w-full" />
           <Skeleton className="h-4 w-full" />
           <Skeleton className="h-4 w-3/4" />
        </Card>
      )}

      {analysis && (
        <>
        <div className="grid lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-6">
            <Section title="AI Summary"><p className="text-muted">{analysis.summary}</p></Section>
            <Section title="Key Findings">
              <ul className="list-disc pl-5 space-y-1 text-muted">
                {analysis.keyFindings.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
            </Section>
            <Section title="Recommendations">
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-surface p-3 rounded-lg">
                  <h4 className="font-semibold mb-1">Proactive</h4>
                  <ul className="list-disc pl-4 space-y-1 text-muted">{analysis.recommendations.proactive.map((r,i) => <li key={i}>{r}</li>)}</ul>
                </div>
                <div className="bg-surface p-3 rounded-lg">
                  <h4 className="font-semibold mb-1">Environmental</h4>
                  <ul className="list-disc pl-4 space-y-1 text-muted">{analysis.recommendations.environmental.map((r,i) => <li key={i}>{r}</li>)}</ul>
                </div>
                <div className="bg-surface p-3 rounded-lg">
                  <h4 className="font-semibold mb-1">Reactive</h4>
                  <ul className="list-disc pl-4 space-y-1 text-muted">{analysis.recommendations.reactive.map((r,i) => <li key={i}>{r}</li>)}</ul>
                </div>
              </div>
            </Section>
            <Section title="Suggested SMART Goal">
                <p className="font-semibold text-text">{analysis.suggestedGoal.statement}</p>
                <p className="text-sm text-muted">Timeframe: {analysis.suggestedGoal.timeframeWeeks} weeks</p>
                <div className="mt-4">
                    <Button onClick={handleTrackGoal} disabled={isGoalTracked}>
                        <Target size={16} />
                        {isGoalTracked ? 'Goal is Being Tracked' : 'Track this Goal'}
                    </Button>
                </div>
            </Section>
          </div>
          <div className="lg:col-span-1 space-y-6">
            <Section title="Potential Triggers">
              <div className="space-y-2">
                {analysis.triggers.map((t, i) => (
                  <ConfidenceBar key={i} label={t.label} value={t.confidence * 100} />
                ))}
              </div>
            </Section>
            <Section title="Attachments">
              {session.attachments && session.attachments.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    {session.attachments.map((att, index) => att.kind === 'image' && (
                        <button key={att.url} onClick={() => openImageViewer(imageAttachments.findIndex(img => img.url === att.url))}>
                            <img src={att.url} alt={att.name} className="w-full h-20 object-cover rounded-md hover:scale-105 transition-transform" />
                        </button>
                    ))}
                  </div>
                  <div className="space-y-2">
                     {session.attachments.map((att) => att.kind === 'audio' && (
                        <div key={att.url}>
                            <p className="text-sm font-semibold mb-1 truncate">{att.name}</p>
                            <audio controls src={att.url} className="w-full" />
                        </div>
                     ))}
                  </div>
                </div>
              ) : (
                <p className="text-muted text-sm">No attachments were added.</p>
              )}
            </Section>
             <Button variant="primary" className="w-full" onClick={() => setIsCoachOpen(true)}>
                <Lightbulb size={18} /> Open AI Coach
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted text-center italic">Caveat: {analysis.caveats.join(' ')} Model: {analysis.model}.</p>
        <Modal isOpen={isCoachOpen} onClose={() => setIsCoachOpen(false)} title={`AI Coach for ${session.student}`} variant="sheet">
            <CoachPane analysis={analysis} />
        </Modal>
        </>
      )}
      
      <Modal isOpen={isViewerOpen} onClose={() => setIsViewerOpen(false)} title={`Image ${viewerIndex + 1} of ${imageAttachments.length}`}>
        {imageAttachments.length > 0 && (
            <div className="relative">
                <img src={imageAttachments[viewerIndex].url} alt={imageAttachments[viewerIndex].name} className="max-h-[70vh] w-auto mx-auto rounded-md" />
                {imageAttachments.length > 1 && (
                    <>
                        <Button variant="secondary" onClick={() => changeImageViewer(-1)} className="!absolute top-1/2 -translate-y-1/2 left-2 !p-2 rounded-full">&lt;</Button>
                        <Button variant="secondary" onClick={() => changeImageViewer(1)} className="!absolute top-1/2 -translate-y-1/2 right-2 !p-2 rounded-full">&gt;</Button>
                    </>
                )}
            </div>
        )}
      </Modal>
    </div>
  );
}