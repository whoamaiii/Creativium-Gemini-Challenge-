
import type { Emotion, SensoryChannel } from './constants';

// Re-exporting types from constants.ts to have a central type definition file
export type { Emotion, SensoryChannel } from './constants';

export interface Student {
  id: string;
  name: string;
}

export type Attachment = {
  kind: 'image' | 'audio';
  name:string;
  url: string; // For images, a data URL. For audio, a blob URL.
  type: string; // mime type
  file: File; // The original file object
};

export interface SessionEntry {
  id: string;
  student: string;
  timeISO: string;
  location: string;
  activity: string;
  peers: string; // e.g., 'Alone', 'With 1-2 others', 'Small group', 'Large group'
  emotions: Emotion[];
  sensory: Record<SensoryChannel, number>; // Sliders from 0-10
  triggers: string[];
  teacherActions: string[];
  notes: string;
  attachments?: Attachment[];
}

export interface AIAnalysis {
  studentName?: string;
  summary: string;
  keyFindings: string[];
  patterns: {
    pattern: string;
    evidence: string[];
  }[];
  triggers: {
    label: string;
    confidence: number;
    evidence: string[];
  }[];
  recommendations: {
    proactive: string[];
    environmental: string[];
    reactive: string[];
  };
  suggestedGoal: {
    statement: string;
    timeframeWeeks: number;
  };
  caveats: string[];
  model: string;
  latencyMs: number;
}

export type GoalStatus = 'suggested' | 'active' | 'completed' | 'archived';

export interface ProgressNote {
  id: string;
  dateISO: string;
  note: string;
}

export interface Goal {
  id: string;
  studentId: string;
  studentName: string;
  statement: string;
  timeframeWeeks: number;
  originSessionId: string;
  status: GoalStatus;
  createdAtISO: string;
  progressNotes: ProgressNote[];
}