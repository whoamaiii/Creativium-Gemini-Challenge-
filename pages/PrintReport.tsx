import React, { useEffect } from 'react';
import { useStore } from '../services/store';
import { parseHashSearch } from '../utils/hashParams';
import Button from '../components/Button';
import ConfidenceBar from '../components/ConfidenceBar';

const PrintReport: React.FC = () => {
  const { sessions, analyses } = useStore.getState();
  const params = parseHashSearch();
  const sessionId = params.get('id');
  
  const session = sessions.find(s => s.id === sessionId);
  const analysis = analyses[sessionId ?? ''];

  useEffect(() => {
    if (session && analysis) {
      document.title = `Report - ${session.student} - ${new Date(session.timeISO).toLocaleDateString()}`;
      // Allow a brief moment for styles to apply before printing
      const printTimeout = setTimeout(() => window.print(), 500);
      return () => clearTimeout(printTimeout);
    }
  }, [session, analysis]);

  if (!session || !analysis) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold">Report Not Found</h1>
        <p className="text-muted mt-2">Could not find the session or analysis to print.</p>
        <div className="mt-6 no-print">
            <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 print-container">
      <header className="flex justify-between items-center mb-8 pb-4 border-b">
        <div>
            <h1 className="text-3xl font-bold">Session Insight Report</h1>
            <p className="text-muted">Student: {session.student} | Date: {new Date(session.timeISO).toLocaleString()}</p>
        </div>
        <div className="no-print">
            <Button onClick={() => window.location.hash = `#/insights?id=${session.id}`}>Back to App</Button>
        </div>
      </header>
      
      <section className="mb-6">
        <h2 className="text-xl font-bold border-b pb-2 mb-3">AI Summary</h2>
        <p>{analysis.summary}</p>
      </section>

      <section className="mb-6 page-break">
        <h2 className="text-xl font-bold border-b pb-2 mb-3">Key Findings</h2>
        <ul className="list-disc pl-6 space-y-1">{analysis.keyFindings.map((f,i)=><li key={i}>{f}</li>)}</ul>
      </section>
      
      <section className="mb-6">
        <h2 className="text-xl font-bold border-b pb-2 mb-3">Potential Triggers</h2>
        <div className="space-y-4">
          {analysis.triggers.map((t, i) => <ConfidenceBar key={i} label={t.label} value={t.confidence * 100} />)}
        </div>
      </section>

      <section className="mb-6 page-break">
        <h2 className="text-xl font-bold border-b pb-2 mb-3">Recommendations</h2>
        <div className="space-y-4">
            <div>
                <h3 className="font-semibold text-lg">Proactive</h3>
                <ul className="list-disc pl-6 text-sm space-y-1">{analysis.recommendations.proactive.map((r,i)=><li key={i}>{r}</li>)}</ul>
            </div>
             <div>
                <h3 className="font-semibold text-lg mt-4">Environmental</h3>
                <ul className="list-disc pl-6 text-sm space-y-1">{analysis.recommendations.environmental.map((r,i)=><li key={i}>{r}</li>)}</ul>
            </div>
             <div>
                <h3 className="font-semibold text-lg mt-4">Reactive</h3>
                <ul className="list-disc pl-6 text-sm space-y-1">{analysis.recommendations.reactive.map((r,i)=><li key={i}>{r}</li>)}</ul>
            </div>
        </div>
      </section>
      
       <section className="mb-6">
        <h2 className="text-xl font-bold border-b pb-2 mb-3">Suggested SMART Goal</h2>
        <p className="font-semibold">{analysis.suggestedGoal.statement}</p>
        <p className="text-sm text-muted">Timeframe: {analysis.suggestedGoal.timeframeWeeks} weeks</p>
      </section>
    </div>
  );
};

export default PrintReport;
