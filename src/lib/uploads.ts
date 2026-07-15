import { supabase } from "@/lib/supabase";
import type { HistoryItem } from "@/lib/auth-store";

interface UploadRow {
  id: string;
  original_name: string;
  size_bytes: number;
  result_url: string;
  original_url: string | null;
  created_at: string;
}

function formatSize(bytes: number): string {
  if (!bytes || bytes <= 0) return "—";
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function mapRow(r: UploadRow): HistoryItem {
  return {
    id: r.id,
    originalName: r.original_name,
    originalUrl: r.original_url ?? "",
    resultUrl: r.result_url,
    size: formatSize(r.size_bytes),
    timestamp: new Date(r.created_at).getTime(),
  };
}

/** Load the signed-in user's upload history from Supabase (RLS-scoped). */
export async function fetchUploads(): Promise<HistoryItem[]> {
  const { data, error } = await supabase
    .from("uploads")
    .select("id, original_name, size_bytes, result_url, original_url, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return ((data as UploadRow[]) ?? []).map(mapRow);
}

/**
 * Delete a history item. Goes through /api/delete-upload so the Cloudinary
 * assets are destroyed server-side (needs the API secret); that endpoint also
 * removes the Supabase row.
 */
export async function deleteUpload(id: string): Promise<void> {
  const { data: sessionData } = await supabase.auth.getSession();
  const session = sessionData.session;
  if (!session) throw new Error("You need to be signed in.");

  const resp = await fetch("/api/delete-upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ id }),
  });

  if (!resp.ok) {
    const data = (await resp.json().catch(() => ({}))) as Record<string, unknown>;
    throw new Error((data.detail as string) || (data.error as string) || "Failed to delete.");
  }
}
