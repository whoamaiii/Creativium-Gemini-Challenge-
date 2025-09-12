
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { SessionEntry, AIAnalysis, Student, Goal, GoalStatus, ProgressNote } from '../types';
import { storage } from './storage';

// In a real app, this would be a more robust ID generation.
const generateId = () => `id_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

// Mock data for initial state
const MOCK_STUDENTS: Student[] = [
  { id: 's1', name: 'Alex' },
  { id: 's2', name: 'Ben' },
];

interface AppState {
  students: Student[];
  sessions: SessionEntry[];
  analyses: Record<string, AIAnalysis>;
  goals: Goal[];
  
  // Actions
  addStudent: (name: string) => void;
  deleteStudent: (id: string) => void;
  
  addSession: (session: Omit<SessionEntry, 'id' | 'timeISO'>) => string;
  updateSession: (id: string, changes: Partial<Omit<SessionEntry, 'id' | 'timeISO'>>) => void;
  deleteSession: (id: string) => void;
  getSession: (id: string) => SessionEntry | undefined;
  getLatestSession: () => SessionEntry | undefined;
  
  saveAnalysis: (sessionId: string, analysis: AIAnalysis) => void;
  getAnalysis: (sessionId: string) => AIAnalysis | undefined;

  addGoal: (goalData: Omit<Goal, 'id' | 'studentId' | 'status' | 'createdAtISO' | 'progressNotes'>) => void;
  updateGoalStatus: (goalId: string, status: GoalStatus) => void;
  addProgressNote: (goalId: string, note: string) => void;

  clearAllSessions: () => void;
  deleteSessions: (ids: string[]) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      students: MOCK_STUDENTS,
      sessions: [],
      analyses: {},
      goals: [],
      
      addStudent: (name) => set((state) => ({
        students: [...state.students, { id: generateId(), name }],
      })),

      deleteStudent: (id) => set((state) => ({
        students: state.students.filter(s => s.id !== id),
        // Optional: also delete sessions for this student
      })),

      addSession: (sessionData) => {
        const newSession: SessionEntry = {
          ...sessionData,
          id: generateId(),
          timeISO: new Date().toISOString(),
        };
        set((state) => ({ sessions: [newSession, ...state.sessions] }));
        return newSession.id;
      },

      updateSession: (id, changes) => set((state) => ({
        sessions: state.sessions.map(s => s.id === id ? { ...s, ...changes } : s),
      })),
      
      deleteSession: (id) => set((state) => ({
        sessions: state.sessions.filter(s => s.id !== id),
      })),
      
      getSession: (id: string) => get().sessions.find(s => s.id === id),

      getLatestSession: () => {
        const sessions = get().sessions;
        if (sessions.length === 0) return undefined;
        // Assuming sessions are sorted by date descending
        return sessions[0];
      },
      
      saveAnalysis: (sessionId, analysis) => set((state) => ({
        analyses: { ...state.analyses, [sessionId]: analysis },
      })),

      getAnalysis: (sessionId: string) => get().analyses[sessionId],

      addGoal: (goalData) => {
        const { students, goals } = get();
        // Prevent adding a duplicate goal from the same session
        if (goals.some(g => g.originSessionId === goalData.originSessionId)) {
          console.warn('Goal for this session has already been added.');
          return;
        }

        const student = students.find(s => s.name === goalData.studentName);
        if (!student) {
          console.error('Could not find student to attach goal to.');
          return;
        }

        const newGoal: Goal = {
          ...goalData,
          id: generateId(),
          studentId: student.id,
          status: 'suggested',
          createdAtISO: new Date().toISOString(),
          progressNotes: [],
        };
        set({ goals: [newGoal, ...goals] });
      },

      updateGoalStatus: (goalId, status) => set((state) => ({
        goals: state.goals.map(g => g.id === goalId ? { ...g, status } : g),
      })),

      addProgressNote: (goalId, note) => set((state) => ({
        goals: state.goals.map(g => {
          if (g.id === goalId) {
            const newNote: ProgressNote = {
              id: generateId(),
              dateISO: new Date().toISOString(),
              note,
            };
            return { ...g, progressNotes: [newNote, ...g.progressNotes] };
          }
          return g;
        }),
      })),
      
      clearAllSessions: () => set({ sessions: [], analyses: {}, goals: [] }),

      deleteSessions: (ids: string[]) => set((state) => ({
        sessions: state.sessions.filter(s => !ids.includes(s.id)),
        analyses: Object.fromEntries(Object.entries(state.analyses).filter(([k]) => !ids.includes(k))),
        goals: state.goals.filter(g => !ids.includes(g.originSessionId)),
      })),

    }),
    {
      name: 'kreativium:app-store',
      // Fix: Use `localStorage` directly with `createJSONStorage`. The custom `storage` service has an incompatible API (doing its own JSON parsing), which caused the type error. `createJSONStorage` requires a raw storage API like `localStorage`.
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Expose individual getters for non-reactive use
export const getSession = (id: string) => useStore.getState().getSession(id);
export const getLatestSession = () => useStore.getState().getLatestSession();
export const getAnalysis = (id: string) => useStore.getState().getAnalysis(id);
export const saveAnalysis = (id: string, analysis: AIAnalysis) => useStore.getState().saveAnalysis(id, analysis);