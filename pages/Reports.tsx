import React from 'react';
// Fix: Use correct import for GoogleGenAI and Type from @google/genai
import { GoogleGenAI, Type } from '@google/genai';
import { useStore } from '../services/store';
import { AIAnalysis, SessionEntry } from '../types';
import Card from '../components/Card';
import Button from '../components/Button';
import { Loader, AlertTriangle, Lightbulb, CheckCircle, BrainCircuit, Target } from '../components/icons';
import { toastService } from '../services/toast';
import { trendPoints, sensoryFrequency, hourlyAvoidance } from '../utils/analytics';
import LineChart from '../components/charts/LineChart';
import BarChart from '../components/charts/BarChart';
import { downloadCSV } from '../utils/csv';
import ExportToolbar from '../components/ExportToolbar';

// Helper to build a text summary for export/sharing
const buildReportSummary = (analysis: AIAnalysis | null): string => {
  if (!analysis) return "No analysis available.";
  
  const findings = (analysis.keyFindings || []).slice(0, 3).map(f => `• ${f}`).join('\n');
  const goal = analysis.suggestedGoal?.statement ? `\nSuggested Goal: ${analysis.suggestedGoal.statement}` : '';

  return `Kreativium — Session Summary for ${analysis.studentName || 'a student'}\n\n` +
         `Summary:\n${analysis.summary}\n\n` +
         `Top Findings:\n${findings}` +
         `${goal}`;
};


// Fix: Initialize GoogleGenAI with a named apiKey object
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const Reports: React.FC = () => {
  const { sessions, addGoal, goals } = useStore();
  const [analysis, setAnalysis] = React.useState<AIAnalysis | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const reportId = React.useMemo(() => {
    if (sessions.length === 0) return 'no-data';
    const latestSessionDate = new Date(sessions[0].timeISO).getTime();
    return `report-${sessions.length}-${latestSessionDate}`;
  }, [sessions]);

  const summaryText = React.useMemo(() => buildReportSummary(analysis), [analysis]);
  const isGoalTracked = React.useMemo(() => {
    if (!analysis || sessions.length === 0) return false;
    return goals.some(g => g.originSessionId === sessions[0].id);
  }, [analysis, goals, sessions]);


  const generateAnalysis = async () => {
    if (sessions.length < 3) {
      toastService.show('Need at least 3 sessions to generate a meaningful analysis.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    const startTime = Date.now();

    try {
      const prompt = `
        Analyze the following student session data. The data is in JSON format.
        Identify patterns, potential triggers, and provide actionable recommendations for teachers or caregivers.
        The student may have sensory processing sensitivities.
        Provide a concise summary, key findings, patterns with evidence,
        a list of potential triggers with confidence scores, proactive/environmental/reactive recommendations,
        a suggested SMART goal, and any important caveats.
        The student's name is ${sessions[0].student}.
        
        Data (do not include this data in your response, just use it for analysis):
        ${JSON.stringify(sessions.slice(0, 20), null, 2)}
      `;

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
            summary: { type: Type.STRING, description: "A concise summary of the analysis." },
            keyFindings: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of the most important findings." },
            patterns: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { pattern: { type: Type.STRING }, evidence: { type: Type.ARRAY, items: { type: Type.STRING } } } } },
            triggers: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { label: { type: Type.STRING }, confidence: { type: Type.NUMBER }, evidence: { type: Type.ARRAY, items: { type: Type.STRING } } } } },
            recommendations: { type: Type.OBJECT, properties: { proactive: { type: Type.ARRAY, items: { type: Type.STRING } }, environmental: { type: Type.ARRAY, items: { type: Type.STRING } }, reactive: { type: Type.ARRAY, items: { type: Type.STRING } } } },
            suggestedGoal: { type: Type.OBJECT, properties: { statement: { type: Type.STRING }, timeframeWeeks: { type: Type.INTEGER } } },
            caveats: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
      };

      // Fix: Corrected model name and API call structure as per guidelines.
      const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: "application/json", responseSchema },
      });

      // Fix: Access response text directly from the `text` property.
      const jsonText = result.text.trim();
      const parsedAnalysis: AIAnalysis = JSON.parse(jsonText);
      
      const latencyMs = Date.now() - startTime;
      setAnalysis({
        ...parsedAnalysis,
        studentName: sessions[0].student,
        model: 'gemini-2.5-flash',
        latencyMs,
      });

    } catch (err) {
      console.error("AI Analysis Error:", err);
      setError("Failed to generate AI analysis. The model may have returned an unexpected format.");
      toastService.show("An error occurred while generating the report.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTrackGoal = () => {
    if (!analysis || sessions.length === 0) return;
    addGoal({
      studentName: sessions[0].student,
      statement: analysis.suggestedGoal.statement,
      timeframeWeeks: analysis.suggestedGoal.timeframeWeeks,
      originSessionId: sessions[0].id,
    });
    toastService.show("Goal added to tracker!");
  };

  if (sessions.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted mt-4 max-w-md mx-auto">No session data found. Log your first observation to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8" data-print-root>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-4xl font-bold">Session Insights</h1>
            <p className="text-muted mt-2">Visualize trends and generate AI-powered insights.</p>
        </div>
        <div className="flex gap-2 flex-wrap justify-end no-print">
           <ExportToolbar sessionId={reportId} summaryText={summaryText} />
           <Button variant="primary" onClick={generateAnalysis} isLoading={isLoading} disabled={sessions.length < 3}>
            <BrainCircuit size={20} />
            {isLoading ? 'Analyzing...' : 'Generate AI Analysis'}
           </Button>
        </div>
      </div>
      
      {sessions.length < 3 && (
        <Card className="!bg-warn/10 border border-warn/20 no-print">
          <div className="flex items-center gap-4">
            <AlertTriangle className="text-warn" size={28} />
            <div>
              <h3 className="font-semibold text-warn">Awaiting More Data</h3>
              <p className="text-warn/80 text-sm">You need at least 3 sessions to generate an AI analysis.</p>
            </div>
          </div>
        </Card>
      )}

      {/* --- Data Visualizations --- */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Emotion Trend</h2>
            <div className="h-64">
              <LineChart data={trendPoints(sessions)} />
            </div>
          </Card>
          <Card>
             <h2 className="text-xl font-semibold mb-4">Sensory Events</h2>
             <div className="h-64">
                <BarChart
                  data={sensoryFrequency(sessions)}
                  layout="horizontal"
                  onBarClick={(d) => {
                    const q = encodeURIComponent(d.label);
                    window.location.hash = `#/sessions?q=${q}`;
                  }}
                />
             </div>
          </Card>
      </div>

      {/* --- AI Analysis Display --- */}
      {isLoading && <Card className="text-center py-12 no-print"><Loader size={48} className="mx-auto text-brand" /><h2 className="text-2xl font-semibold mt-6">Generating AI Insights...</h2></Card>}
      
      {error && <Card className="!bg-error/10 border border-error/20 no-print"><div className="flex items-start gap-4"><AlertTriangle className="text-error mt-1" size={24} /><div><h3 className="font-semibold text-error">Analysis Failed</h3><p className="text-error/80">{error}</p></div></div></Card>}
      
      {analysis && (
        <Card className="space-y-6 !border-brand/50 ring-2 ring-brand/20">
          <h2 className="text-3xl font-bold flex items-center gap-3"><BrainCircuit className="text-brand" /> AI-Powered Analysis</h2>
          <div className="prose prose-invert max-w-none prose-p:text-muted prose-headings:text-text prose-strong:text-text prose-ul:list-disc prose-li:marker:text-brand">
            <p><strong>Summary:</strong> {analysis.summary}</p>
            <h3><CheckCircle className="inline-block mr-2 text-success" /> Key Findings</h3>
            <ul>{analysis.keyFindings.map((finding, i) => <li key={i}>{finding}</li>)}</ul>
            <h3><Lightbulb className="inline-block mr-2 text-warn" /> Identified Patterns</h3>
            {analysis.patterns.map((p, i) => (<div key={i} className="p-4 bg-surface rounded-lg mb-4"><p><strong>{p.pattern}</strong></p><ul className="text-sm">{p.evidence.map((e, j) => <li key={j}>{e}</li>)}</ul></div>))}
            <h3><AlertTriangle className="inline-block mr-2 text-error" /> Potential Triggers</h3>
            <ul>{analysis.triggers.map((t, i) => <li key={i}>{t.label} (Confidence: {Math.round(t.confidence * 100)}%)</li>)}</ul>
            <h3>Actionable Recommendations</h3>
            <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-surface rounded-lg"><strong>Proactive</strong><ul>{analysis.recommendations.proactive.map((r, i) => <li key={i}>{r}</li>)}</ul></div>
                <div className="p-4 bg-surface rounded-lg"><strong>Environmental</strong><ul>{analysis.recommendations.environmental.map((r, i) => <li key={i}>{r}</li>)}</ul></div>
                 <div className="p-4 bg-surface rounded-lg"><strong>Reactive</strong><ul>{analysis.recommendations.reactive.map((r, i) => <li key={i}>{r}</li>)}</ul></div>
            </div>
            <div className="p-4 bg-surface rounded-lg mt-4">
              <h3 className="!mt-0">Suggested Goal</h3>
              <p><strong>Statement:</strong> {analysis.suggestedGoal.statement}</p>
              <p><strong>Timeframe:</strong> {analysis.suggestedGoal.timeframeWeeks} weeks</p>
              <div className="mt-4 not-prose">
                  <Button onClick={handleTrackGoal} disabled={isGoalTracked}>
                      <Target size={16} />
                      {isGoalTracked ? 'Goal is Being Tracked' : 'Track this Goal'}
                  </Button>
              </div>
            </div>
            <p className="text-xs italic text-muted/80 mt-6"><strong>Caveats:</strong> {analysis.caveats.join(' ')}</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Reports;