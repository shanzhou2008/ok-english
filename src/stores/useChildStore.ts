import { create } from 'zustand';

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
}

const defaultChild: ChildProfile = {
  id: 'child-1',
  nickname: '小兔子',
  ageGroup: 2,
  avatar: '🐰',
};

export const useChildStore = create<ChildStore>((set, get) => ({
  children: [defaultChild],
  currentChildIndex: 0,
  currentChild: defaultChild,

  setAgeGroup: (group) => {
    const { children, currentChildIndex } = get();
    const updated = [...children];
    updated[currentChildIndex] = { ...updated[currentChildIndex], ageGroup: group };
    set({
      children: updated,
      currentChild: updated[currentChildIndex],
    });
  },

  setNickname: (name) => {
    const { children, currentChildIndex } = get();
    const updated = [...children];
    updated[currentChildIndex] = { ...updated[currentChildIndex], nickname: name };
    set({
      children: updated,
      currentChild: updated[currentChildIndex],
    });
  },

  switchChild: (index) => {
    const { children } = get();
    if (index >= 0 && index < children.length) {
      set({
        currentChildIndex: index,
        currentChild: children[index],
      });
    }
  },
}));
