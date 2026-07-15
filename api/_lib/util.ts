import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { VercelRequest } from "@vercel/node";

/** Supabase URL + anon key, read from server env (falls back to the VITE_ vars). */
export function getSupabaseEnv() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  return { url, anonKey };
}

/** Extract the caller's JWT from the Authorization header. */
export function bearerToken(req: VercelRequest): string | null {
  const h = req.headers.authorization;
  if (!h || Array.isArray(h) || !h.startsWith("Bearer ")) return null;
  return h.slice("Bearer ".length).trim() || null;
}

/**
 * A Supabase client scoped to the signed-in user. We forward the user's JWT
 * so Row Level Security applies exactly as it would from the browser, and
 * auth.uid() resolves inside RPCs like consume_image_credit().
 */
export function userClient(token: string): SupabaseClient {
  const { url, anonKey } = getSupabaseEnv();
  return createClient(url as string, anonKey as string, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Vercel usually parses JSON bodies, but be defensive if it arrives as a string. */
export function readJsonBody(req: VercelRequest): Record<string, unknown> {
  const b = req.body;
  if (!b) return {};
  if (typeof b === "string") {
    try {
      return JSON.parse(b) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  return b as Record<string, unknown>;
}
