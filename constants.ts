
// Fix: Define EMOTIONS with 'as const' and derive the Emotion type here to break a circular dependency.
export const EMOTIONS = ['Calm', 'Happy', 'Anxious', 'Frustrated', 'Overwhelmed'] as const;
export type Emotion = (typeof EMOTIONS)[number];

export const EMOTIONS_WITH_EMOJI: { key: Emotion, emoji: string, label: string }[] = [
    { key: 'Happy', emoji: '😊', label: 'Happy' },
    { key: 'Calm', emoji: '😌', label: 'Calm' },
    { key: 'Anxious', emoji: '😟', label: 'Anxious' },
    { key: 'Frustrated', emoji: '😠', label: 'Frustrated' },
    { key: 'Overwhelmed', emoji: '🤯', label: 'Overwhelmed' },
];

// Fix: Define SENSORY_CHANNELS with 'as const' and derive the SensoryChannel type here.
export const SENSORY_CHANNELS = [
  'Auditory',
  'Visual',
  'Tactile',
  'Vestibular',
  'Proprioceptive',
  'Olfactory',
  'Gustatory',
] as const;
export type SensoryChannel = (typeof SENSORY_CHANNELS)[number];

export const TEACHER_REACTIONS: string[] = [
  'Redirect',
  'Planned Break',
  'Sensory Tool',
  'Positive Reinforcement',
  'Environment Adjust',
  'Visual Support',
  'Co Regulation',
  'Document Incident',
  'Other',
];

export const QUICK_ADD_TRIGGERS: string[] = [
    'Loud noises',
    'Bright lights',
    'Unexpected touch',
    'Crowded spaces',
    'Changes in routine',
    'Difficult tasks',
];
