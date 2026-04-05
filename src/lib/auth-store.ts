import type { Session } from "@supabase/supabase-js";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabase";
import type { UserStatsRow } from "@/lib/user-stats";

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

let authInitPromise: Promise<void> | null = null;

function mapUser(session: Session | null): User | null {
  const u = session?.user;
  if (!u) return null;
  const meta = u.user_metadata as { full_name?: string } | undefined;
  const name =
    (typeof meta?.full_name === "string" && meta.full_name.trim()) ||
    u.email?.split("@")[0] ||
    "User";
  return {
    id: u.id,
    email: u.email ?? "",
    name,
  };
}

function normalizeStats(raw: unknown): UserStatsRow | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const id = o.id;
  const plan = o.plan;
  if (typeof id !== "string" || (plan !== "free" && plan !== "pro")) return null;
  return {
    id,
    plan,
    credits_remaining: Number(o.credits_remaining ?? 0),
    total_images_processed: Number(o.total_images_processed ?? 0),
    monthly_images_processed: Number(o.monthly_images_processed ?? 0),
    month_key: String(o.month_key ?? ""),
    updated_at: String(o.updated_at ?? ""),
  };
}

type ConsumeRpcResult = {
  ok?: boolean;
  error?: string;
  stats?: unknown;
};

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  authReady: boolean;
  userStats: UserStatsRow | null;
  userStatsLoading: boolean;
  history: HistoryItem[];
  initializeAuth: () => Promise<void>;
  syncFromSession: (session: Session | null) => void;
  fetchUserStats: () => Promise<void>;
  consumeImageCredit: () => Promise<{ ok: boolean; error?: string }>;
  signInWithPassword: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ error: string | null; needsEmailConfirmation: boolean }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  resetPasswordForEmail: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  addToHistory: (item: Omit<HistoryItem, "id" | "timestamp">) => void;
  removeFromHistory: (id: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      authReady: false,
      userStats: null,
      userStatsLoading: false,
      history: [],

      syncFromSession: (session) => {
        const user = mapUser(session);
        set({
          user,
          isAuthenticated: !!user,
        });
      },

      fetchUserStats: async () => {
        const uid = get().user?.id;
        if (!uid) {
          set({ userStats: null, userStatsLoading: false });
          return;
        }
        set({ userStatsLoading: true });
        const { data, error } = await supabase.from("user_stats").select("*").eq("id", uid).maybeSingle();
        if (error) {
          console.error("fetchUserStats:", error);
          set({ userStatsLoading: false });
          return;
        }
        if (!data) {
          const { data: inserted, error: insErr } = await supabase
            .from("user_stats")
            .insert({ id: uid })
            .select()
            .single();
          set({
            userStats: insErr ? null : normalizeStats(inserted),
            userStatsLoading: false,
          });
          return;
        }
        set({ userStats: normalizeStats(data), userStatsLoading: false });
      },

      consumeImageCredit: async () => {
        const { data, error } = await supabase.rpc("consume_image_credit");
        if (error) {
          return { ok: false, error: error.message };
        }
        const result = data as ConsumeRpcResult;
        const stats = normalizeStats(result.stats);
        if (stats) set({ userStats: stats });
        if (result.ok) return { ok: true };
        return {
          ok: false,
          error:
            result.error === "no_credits"
              ? "no_credits"
              : result.error ?? "unknown",
        };
      },

      initializeAuth: () => {
        if (authInitPromise) return authInitPromise;
        authInitPromise = (async () => {
          const {
            data: { session },
          } = await supabase.auth.getSession();
          get().syncFromSession(session);
          if (session?.user) {
            await get().fetchUserStats();
          } else {
            set({ userStats: null });
          }
          set({ authReady: true });
          supabase.auth.onAuthStateChange(async (_event, nextSession) => {
            get().syncFromSession(nextSession);
            if (nextSession?.user) {
              await get().fetchUserStats();
            } else {
              set({ userStats: null });
            }
          });
        })();
        return authInitPromise;
      },

      signInWithPassword: async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error: error?.message ?? null };
      },

      signUp: async (email, password, name) => {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
            emailRedirectTo: `${window.location.origin}/dashboard/upload`,
          },
        });
        if (error) return { error: error.message, needsEmailConfirmation: false };
        const needsEmailConfirmation = !data.session;
        return { error: null, needsEmailConfirmation };
      },

      signInWithGoogle: async () => {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/dashboard/upload`,
          },
        });
        return { error: error?.message ?? null };
      },

      resetPasswordForEmail: async (email) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        return { error: error?.message ?? null };
      },

      signOut: async () => {
        await supabase.auth.signOut();
        set({ userStats: null });
      },

      addToHistory: (item) => {
        const newItem: HistoryItem = {
          ...item,
          id: Math.random().toString(36).slice(2, 11),
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
      name: "snapcut-auth-v3",
      partialize: (state) => ({
        history: state.history,
      }),
    }
  )
);
