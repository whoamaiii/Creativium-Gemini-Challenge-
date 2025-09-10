import type { SessionEntry } from '../types';
import { SENSORY_CHANNELS } from '../constants';

/**
 * Converts an array of SessionEntry objects to a CSV string.
 * @param data The session entries to convert.
 * @returns A string in CSV format.
 */
const convertToCSV = (data: SessionEntry[]): string => {
  if (data.length === 0) return '';

  const headers = [
    'id',
    'student',
    'timeISO',
    'location',
    'activity',
    'peers',
    'emotions',
    ...SENSORY_CHANNELS.map(ch => `sensory_${ch.toLowerCase()}`),
    'triggers',
    'teacherActions',
    'notes',
  ];

  const rows = data.map(entry => {
    const sanitizedNotes = `"${entry.notes.replace(/"/g, '""')}"`;
    const sensoryValues = SENSORY_CHANNELS.map(ch => entry.sensory[ch]);

    return [
      entry.id,
      entry.student,
      entry.timeISO,
      entry.location,
      entry.activity,
      entry.peers,
      `"${entry.emotions.join(', ')}"`,
      ...sensoryValues,
      `"${entry.triggers.join(', ')}"`,
      `"${entry.teacherActions.join(', ')}"`,
      sanitizedNotes,
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
};

/**
 * Triggers a browser download for the given CSV content.
 * @param sessions The session data to be downloaded.
 */
export const downloadCSV = (sessions: SessionEntry[]): void => {
  const csvString = convertToCSV(sessions);
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    const date = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `kreativium_sessions_${date}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
