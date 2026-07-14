import { create } from 'zustand';

interface WeeklyDataPoint {
  day: string;
  minutes: number;
}

interface LearningStore {
  todayMinutes: number;
  todayGoal: number;
  completedSongs: string[];
  completedGames: string[];
  gameStars: Record<string, number>;
  speakingScore: number;
  weeklyData: WeeklyDataPoint[];
  addMinutes: (mins: number) => void;
  completeSong: (id: string) => void;
  completeGame: (id: string, stars: number) => void;
  setSpeakingScore: (score: number) => void;
}

const initialWeeklyData: WeeklyDataPoint[] = [
  { day: '周一', minutes: 12 },
  { day: '周二', minutes: 18 },
  { day: '周三', minutes: 8 },
  { day: '周四', minutes: 15 },
  { day: '周五', minutes: 20 },
  { day: '周六', minutes: 10 },
  { day: '周日', minutes: 5 },
];

// localStorage 持久化
const STORAGE_KEY = 'ok-english-learning';

function loadFromStorage(): Partial<LearningStore> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveToStorage(state: LearningStore) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        completedSongs: state.completedSongs,
        completedGames: state.completedGames,
        gameStars: state.gameStars,
        todayMinutes: state.todayMinutes,
        speakingScore: state.speakingScore,
      })
    );
  } catch {
    // ignore
  }
}

const persisted = loadFromStorage();

export const useLearningStore = create<LearningStore>((set) => ({
  todayMinutes: persisted.todayMinutes ?? 8,
  todayGoal: 15,
  completedSongs: persisted.completedSongs ?? [],
  completedGames: persisted.completedGames ?? [],
  gameStars: persisted.gameStars ?? {},
  speakingScore: persisted.speakingScore ?? 0,
  weeklyData: initialWeeklyData,

  addMinutes: (mins) =>
    set((state) => {
      const next = { ...state, todayMinutes: state.todayMinutes + mins };
      saveToStorage(next);
      return { todayMinutes: next.todayMinutes };
    }),

  completeSong: (id) =>
    set((state) => {
      if (state.completedSongs.includes(id)) return state;
      const next = {
        ...state,
        completedSongs: [...state.completedSongs, id],
      };
      saveToStorage(next);
      return { completedSongs: next.completedSongs };
    }),

  completeGame: (id, stars) =>
    set((state) => {
      const prevStars = state.gameStars[id] ?? 0;
      const next = {
        ...state,
        completedGames: state.completedGames.includes(id)
          ? state.completedGames
          : [...state.completedGames, id],
        gameStars: {
          ...state.gameStars,
          [id]: Math.max(prevStars, stars),
        },
      };
      saveToStorage(next);
      return {
        completedGames: next.completedGames,
        gameStars: next.gameStars,
      };
    }),

  setSpeakingScore: (score) =>
    set((state) => {
      const next = { ...state, speakingScore: score };
      saveToStorage(next);
      return { speakingScore: score };
    }),
}));
