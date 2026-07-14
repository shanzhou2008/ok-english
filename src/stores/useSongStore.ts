import { create } from 'zustand';
import { songs } from '@/data/songs';

export interface SongStore {
  favorites: string[];
  addFavorite: (songId: string) => void;
  removeFavorite: (songId: string) => void;
  toggleFavorite: (songId: string) => void;
  isFavorite: (songId: string) => boolean;
  getFavoriteSongs: () => typeof songs;
  loadFavorites: (userId: string) => void;
  saveFavorites: (userId: string) => void;
}

function loadFavoritesFromStorage(userId: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`ok-english-favorites-${userId}`);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveFavoritesToStorage(userId: string, favorites: string[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`ok-english-favorites-${userId}`, JSON.stringify(favorites));
  } catch {
    // ignore
  }
}

export const useSongStore = create<SongStore>((set, get) => ({
  favorites: [],

  addFavorite: (songId) => {
    set((state) => {
      if (state.favorites.includes(songId)) return state;
      return { favorites: [...state.favorites, songId] };
    });
  },

  removeFavorite: (songId) => {
    set((state) => ({
      favorites: state.favorites.filter((id) => id !== songId),
    }));
  },

  toggleFavorite: (songId) => {
    const { favorites, addFavorite, removeFavorite } = get();
    if (favorites.includes(songId)) {
      removeFavorite(songId);
    } else {
      addFavorite(songId);
    }
  },

  isFavorite: (songId) => {
    return get().favorites.includes(songId);
  },

  getFavoriteSongs: () => {
    const { favorites } = get();
    return songs.filter((song) => favorites.includes(song.id));
  },

  loadFavorites: (userId) => {
    const favorites = loadFavoritesFromStorage(userId);
    set({ favorites });
  },

  saveFavorites: (userId) => {
    const { favorites } = get();
    saveFavoritesToStorage(userId, favorites);
  },
}));
