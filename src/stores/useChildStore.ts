import { create } from 'zustand';
import { useAuthStore } from './useAuthStore';

export interface ChildProfile {
  id: string;
  nickname: string;
  ageGroup: 1 | 2 | 3; // 1=2-3岁, 2=3-4岁, 3=4-5岁
  avatar: string;
}

interface ChildStore {
  children: ChildProfile[];
  currentChildIndex: number;
  currentChild: ChildProfile;
  setAgeGroup: (group: 1 | 2 | 3) => void;
  setNickname: (name: string) => void;
  switchChild: (index: number) => void;
  loadUserData: () => void;
}

const defaultChild: ChildProfile = {
  id: 'child-1',
  nickname: '小兔子',
  ageGroup: 2,
  avatar: '🐰',
};

function getStorageKey(): string {
  const currentUser = useAuthStore.getState().currentUser;
  return `ok-english-child-${currentUser?.id || 'default'}`;
}

function loadFromStorage(): Partial<ChildStore> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(getStorageKey());
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveToStorage(state: ChildStore) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(
      getStorageKey(),
      JSON.stringify({
        children: state.children,
        currentChildIndex: state.currentChildIndex,
      })
    );
  } catch {
    // ignore
  }
}

const persisted = loadFromStorage();

const initialChildren = persisted.children ?? [defaultChild];
const initialIndex = persisted.currentChildIndex ?? 0;

export const useChildStore = create<ChildStore>((set, get) => ({
  children: initialChildren,
  currentChildIndex: initialIndex,
  currentChild: initialChildren[initialIndex] || defaultChild,

  loadUserData: () => {
    const data = loadFromStorage();
    const children = data.children ?? [defaultChild];
    const index = data.currentChildIndex ?? 0;
    set({
      children,
      currentChildIndex: index,
      currentChild: children[index] || defaultChild,
    });
  },

  setAgeGroup: (group) => {
    const { children, currentChildIndex } = get();
    const updated = [...children];
    updated[currentChildIndex] = { ...updated[currentChildIndex], ageGroup: group };
    const next = {
      children: updated,
      currentChild: updated[currentChildIndex],
    };
    saveToStorage({ ...get(), ...next });
    set(next);
  },

  setNickname: (name) => {
    const { children, currentChildIndex } = get();
    const updated = [...children];
    updated[currentChildIndex] = { ...updated[currentChildIndex], nickname: name };
    const next = {
      children: updated,
      currentChild: updated[currentChildIndex],
    };
    saveToStorage({ ...get(), ...next });
    set(next);
  },

  switchChild: (index) => {
    const { children } = get();
    if (index >= 0 && index < children.length) {
      const next = {
        currentChildIndex: index,
        currentChild: children[index],
      };
      saveToStorage({ ...get(), ...next });
      set(next);
    }
  },
}));
