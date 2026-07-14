import { create } from 'zustand';

export interface User {
  id: string;
  username: string;
  password: string;
  createdAt: number;
}

export interface AuthStore {
  currentUser: User | null;
  users: User[];
  login: (username: string, password: string) => boolean;
  signup: (username: string, password: string) => boolean;
  logout: () => void;
  hasAccount: (username: string) => boolean;
}

const STORAGE_KEY = 'ok-english-users';
const CURRENT_USER_KEY = 'ok-english-current-user';

function loadUsers(): User[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function loadCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveUsers(users: User[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch {
    // ignore
  }
}

function saveCurrentUser(user: User | null) {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  } catch {
    // ignore
  }
}

const initialUsers = loadUsers();
const initialCurrentUser = loadCurrentUser();

export const useAuthStore = create<AuthStore>((set, get) => ({
  currentUser: initialCurrentUser,
  users: initialUsers,

  login: (username, password) => {
    const { users } = get();
    const user = users.find((u) => u.username === username && u.password === password);
    if (user) {
      saveCurrentUser(user);
      set({ currentUser: user });
      return true;
    }
    return false;
  },

  signup: (username, password) => {
    const { users } = get();
    if (users.find((u) => u.username === username)) {
      return false;
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      username,
      password,
      createdAt: Date.now(),
    };
    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);
    saveCurrentUser(newUser);
    set({ users: updatedUsers, currentUser: newUser });
    return true;
  },

  logout: () => {
    saveCurrentUser(null);
    set({ currentUser: null });
  },

  hasAccount: (username) => {
    const { users } = get();
    return users.some((u) => u.username === username);
  },
}));
