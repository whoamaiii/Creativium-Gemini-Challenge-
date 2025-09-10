import type { SessionEntry, AIAnalysis } from '../types';

// This is a mock API service. In a real application, this would make HTTP requests to a backend.

const MOCK_DELAY = 350; // ms

const mockAnalysis: AIAnalysis = {
  summary: "The session indicates a potential sensitivity to auditory stimuli, particularly loud noises, which appears to correlate with increased feelings of being overwhelmed.",
  keyFindings: [
    "Strong reaction to 'Loud noises' trigger.",
    "Sensory input shows a spike in 'Auditory' sensitivity.",
    "Teacher reactions involving 'Sensory Tool' and 'Co Regulation' were logged.",
  ],
  patterns: [
    {
      pattern: "Auditory Overload",
      evidence: ["High auditory sensory input score (8.5)", "Known trigger 'Loud noises' was present.", "Emotion shifted to 'Overwhelmed' during the activity."]
    }
  ],
  triggers: [
    { label: 'Loud noises', confidence: 0.85, evidence: ["Direct observation"] },
    { label: 'Crowded spaces', confidence: 0.60, evidence: ["Correlated with past incidents"] }
  ],
  recommendations: {
    proactive: ["Provide noise-cancelling headphones before transitioning to noisy environments.", "Use a visual schedule to prepare for loud activities."],
    environmental: ["Create a designated 'quiet corner' in the classroom.", "Reduce background noise where possible."],
    reactive: ["Guide the student to the quiet corner when signs of auditory distress appear.", "Practice co-regulation breathing exercises."]
  },
  suggestedGoal: {
    statement: "Student will independently use noise-cancelling headphones in 3 out of 5 anticipated noisy situations within the next 4 weeks.",
    timeframeWeeks: 4
  },
  caveats: ["This analysis is based on a single session and may not be representative of all behaviors."],
  // Fix: Corrected model name to 'gemini-2.5-flash' as per guidelines.
  model: 'gemini-2.5-flash',
  latencyMs: 850
};


export const api = {
  analyzeSession: (entry: SessionEntry): Promise<AIAnalysis> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('API: Analyzed session entry:', entry);
        // Add student name to the analysis for context
        resolve({ ...mockAnalysis, studentName: entry.student });
      }, MOCK_DELAY);
    });
  },
};