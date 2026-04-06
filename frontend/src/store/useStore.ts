import { create } from 'zustand';

export interface User {
  id: number;
  fullName: string;
  email: string;
  full_name?: string;
}

interface AppState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  activeModelId: string;
  setActiveModelId: (id: string) => void;
  chatMessages: { role: string; content: string }[];
  addChatMessage: (msg: { role: string; content: string }) => void;
  user: User | null;
  setUser: (u: User | null) => void;
  logout: () => void;
}

export const useStore = create<AppState>((set) => ({
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  activeCategory: 'All',
  setActiveCategory: (cat) => set({ activeCategory: cat }),
  activeModelId: 'gpt-5',
  setActiveModelId: (id) => set({ activeModelId: id }),
  chatMessages: [],
  addChatMessage: (msg) => set((state) => ({ chatMessages: [...state.chatMessages, msg] })),
  user: null,
  setUser: (u) => set({ user: u }),
  logout: () => {
    document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    set({ user: null });
  }
}));
