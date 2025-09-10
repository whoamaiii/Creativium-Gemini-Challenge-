
import { SENSORY_CHANNELS } from '../constants';
import type { SessionEntry, SensoryChannel } from '../types';

const EMOTION_SCORES: Record<string, number> = {
  'Happy': 10,
  'Calm': 8,
  'Anxious': 4,
  'Frustrated': 2,
  'Overwhelmed': 0,
};

/**
 * Calculates a single emotional score for a session.
 */
const getEmotionScore = (emotions: string[]): number => {
  if (emotions.length === 0) return 5; // Neutral baseline
  const total = emotions.reduce((acc, emotion) => acc + (EMOTION_SCORES[emotion] ?? 5), 0);
  return total / emotions.length;
};

/**
 * Transforms session data into points for a line chart.
 */
export const trendPoints = (sessions: SessionEntry[]) => {
  if (sessions.length < 2) return [];
  return sessions
    .map(s => ({
      x: new Date(s.timeISO),
      y: getEmotionScore(s.emotions),
    }))
    .sort((a, b) => a.x.getTime() - b.x.getTime());
};

/**
 * Calculates the frequency of non-zero sensory events.
 */
export const sensoryFrequency = (sessions: SessionEntry[]) => {
  if (sessions.length === 0) return [];
  const counts = SENSORY_CHANNELS.reduce((acc, channel) => {
    acc[channel] = 0;
    return acc;
  }, {} as Record<SensoryChannel, number>);

  let totalEvents = 0;
  sessions.forEach(session => {
    SENSORY_CHANNELS.forEach(channel => {
      if (session.sensory[channel] > 0) {
        counts[channel]++;
        totalEvents++;
      }
    });
  });
  
  // Return as a percentage of sessions where ANY sensory event happened
  // Fix: Add type assertion to resolve TypeScript error with numeric comparison.
  const sessionsWithSensoryEvents = sessions.filter(s => Object.values(s.sensory).some(v => (v as number) > 0)).length;
  
  if (sessionsWithSensoryEvents === 0) return SENSORY_CHANNELS.map(ch => ({ label: ch, value: 0 }));

  return SENSORY_CHANNELS.map(channel => ({
    label: channel,
    value: (counts[channel] / sessionsWithSensoryEvents) * 100,
  }));
};

/**
 * Calculates the percentage of sessions with high sensory input by hour.
 */
export const hourlyAvoidance = (sessions: SessionEntry[]) => {
  const SENSORY_THRESHOLD = 7;
  const hourlyData: Record<number, { total: number; high: number }> = {};

  for (let i = 0; i < 24; i++) {
    hourlyData[i] = { total: 0, high: 0 };
  }

  sessions.forEach(session => {
    const hour = new Date(session.timeISO).getHours();
    hourlyData[hour].total++;
    // Fix: Add type assertion to ensure Math.max receives an array of numbers.
    const maxSensory = Math.max(...(Object.values(session.sensory) as number[]));
    if (maxSensory >= SENSORY_THRESHOLD) {
      hourlyData[hour].high++;
    }
  });

  return Object.entries(hourlyData).map(([hour, data]) => ({
    label: `${parseInt(hour, 10).toString().padStart(2, '0')}:00`,
    value: data.total > 0 ? (data.high / data.total) * 100 : 0,
  }));
};
