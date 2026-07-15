import type { VercelRequest, VercelResponse } from "@vercel/node";
import { bearerToken, getSupabaseEnv, readJsonBody, userClient } from "./_lib/util.js";
import { getCloudinary } from "./_lib/cloudinary.js";

/**
 * Delete one history item: destroy the Cloudinary assets (needs the API
 * secret, so it must run server-side) and remove the Supabase row.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });

  const { url, anonKey } = getSupabaseEnv();
  if (!url || !anonKey) return res.status(500).json({ error: "server_misconfigured" });

  const token = bearerToken(req);
  if (!token) return res.status(401).json({ error: "unauthorized" });

  const supabase = userClient(token);
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData?.user) return res.status(401).json({ error: "unauthorized" });

  const body = readJsonBody(req);
  const id = typeof body.id === "string" ? body.id : "";
  if (!id) return res.status(400).json({ error: "missing_id" });

  // RLS ensures we can only read our own row.
  const { data: row, error: selErr } = await supabase
    .from("uploads")
    .select("id, result_public_id, original_public_id")
    .eq("id", id)
    .maybeSingle();
  if (selErr) return res.status(500).json({ error: "lookup_failed", detail: selErr.message });
  if (!row) return res.status(404).json({ error: "not_found" });

  // Destroy Cloudinary assets (best-effort — don't block row deletion on it).
  if (process.env.CLOUDINARY_API_SECRET) {
    const cloudinary = getCloudinary();
    const ids = [row.result_public_id, row.original_public_id].filter(Boolean) as string[];
    await Promise.allSettled(ids.map((pid) => cloudinary.uploader.destroy(pid, { resource_type: "image" })));
  }

  const { error: delErr } = await supabase.from("uploads").delete().eq("id", id);
  if (delErr) return res.status(500).json({ error: "delete_failed", detail: delErr.message });

  return res.status(200).json({ ok: true });
}
