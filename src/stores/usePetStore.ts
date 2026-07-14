import { create } from 'zustand';

interface PetStore {
  level: number;
  exp: number;
  expToNext: number;
  stars: number;
  badges: string[];
  addExp: (amount: number) => void;
  addStars: (amount: number) => void;
  earnBadge: (badgeId: string) => void;
}

const STORAGE_KEY = 'ok-english-pet';

function loadFromStorage(): Partial<PetStore> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveToStorage(state: PetStore) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        level: state.level,
        exp: state.exp,
        expToNext: state.expToNext,
        stars: state.stars,
        badges: state.badges,
      })
    );
  } catch {
    // ignore
  }
}

const persisted = loadFromStorage();

export const usePetStore = create<PetStore>((set) => ({
  level: persisted.level ?? 1,
  exp: persisted.exp ?? 0,
  expToNext: persisted.expToNext ?? 100,
  stars: persisted.stars ?? 0,
  badges: persisted.badges ?? [],

  addExp: (amount) =>
    set((state) => {
      let newExp = state.exp + amount;
      let newLevel = state.level;
      let newExpToNext = state.expToNext;

      while (newExp >= newExpToNext) {
        newExp -= newExpToNext;
        newLevel += 1;
        newExpToNext = Math.floor(newExpToNext * 1.2);
      }

      const next = { ...state, level: newLevel, exp: newExp, expToNext: newExpToNext };
      saveToStorage(next);
      return { level: newLevel, exp: newExp, expToNext: newExpToNext };
    }),

  addStars: (amount) =>
    set((state) => {
      const next = { ...state, stars: state.stars + amount };
      saveToStorage(next);
      return { stars: next.stars };
    }),

  earnBadge: (badgeId) =>
    set((state) => {
      if (state.badges.includes(badgeId)) return state;
      const next = { ...state, badges: [...state.badges, badgeId] };
      saveToStorage(next);
      return { badges: next.badges };
    }),
}));
