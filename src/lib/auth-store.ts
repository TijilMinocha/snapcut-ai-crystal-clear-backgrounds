import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  name: string;
}

export interface HistoryItem {
  id: string;
  originalName: string;
  originalUrl: string;
  resultUrl: string;
  timestamp: number;
  size: string;
}

interface AuthState {
  user: User | null;
  credits: number;
  isAuthenticated: boolean;
  history: HistoryItem[];
  login: (email: string, name?: string) => void;
  logout: () => void;
  useCredit: () => boolean;
  addToHistory: (item: Omit<HistoryItem, "id" | "timestamp">) => void;
  removeFromHistory: (id: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      credits: 5,
      isAuthenticated: false,
      history: [],
      login: (email, name = "User") => {
        set({
          user: { id: Math.random().toString(36).substr(2, 9), email, name },
          isAuthenticated: true,
        });
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      useCredit: () => {
        const currentCredits = get().credits;
        if (currentCredits > 0) {
          set({ credits: currentCredits - 1 });
          return true;
        }
        return false;
      },
      addToHistory: (item) => {
        const newItem: HistoryItem = {
          ...item,
          id: Math.random().toString(36).substr(2, 9),
          timestamp: Date.now(),
        };
        set((state) => ({
          history: [newItem, ...state.history],
        }));
      },
      removeFromHistory: (id) => {
        set((state) => ({
          history: state.history.filter((item) => item.id !== id),
        }));
      },
    }),
    {
      name: "snapcut-auth",
    }
  )
);
