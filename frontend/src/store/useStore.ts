import { create } from 'zustand';

interface AppState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  activeModelId: string;
  setActiveModelId: (id: string) => void;
  chatMessages: { role: string; content: string }[];
  addChatMessage: (msg: { role: string; content: string }) => void;
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
}));
