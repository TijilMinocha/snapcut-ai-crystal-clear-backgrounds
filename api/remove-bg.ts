import type { VercelRequest, VercelResponse } from "@vercel/node";
import { bearerToken, getSupabaseEnv, readJsonBody, userClient } from "./_lib/util.js";
import { getCloudinary } from "./_lib/cloudinary.js";

const CLIPDROP_URL = "https://clipdrop-api.co/remove-background/v1";

/**
 * Background-removal pipeline (replaces the old n8n webhook).
 *
 * Client has already uploaded the ORIGINAL to Cloudinary (unsigned) and sends
 * us its URL. We then:
 *   1. verify the signed-in user + check credits (server-authoritative)
 *   2. fetch the original bytes and run them through ClipDrop
 *   3. upload the transparent PNG result to Cloudinary (signed)
 *   4. record the row in Supabase `uploads`
 *   5. consume one credit via the existing atomic RPC
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });

  const { url, anonKey } = getSupabaseEnv();
  if (!url || !anonKey) return res.status(500).json({ error: "server_misconfigured", detail: "supabase env missing" });
  if (!process.env.CLIPDROP_API_KEY) return res.status(500).json({ error: "server_misconfigured", detail: "clipdrop key missing" });
  if (!process.env.CLOUDINARY_API_SECRET) return res.status(500).json({ error: "server_misconfigured", detail: "cloudinary secret missing" });

  const token = bearerToken(req);
  if (!token) return res.status(401).json({ error: "unauthorized" });

  const supabase = userClient(token);
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData?.user) return res.status(401).json({ error: "unauthorized" });
  const user = userData.user;

  const body = readJsonBody(req);
  const originalUrl = typeof body.originalUrl === "string" ? body.originalUrl : "";
  const originalPublicId = typeof body.originalPublicId === "string" ? body.originalPublicId : null;
  const originalName = typeof body.originalName === "string" && body.originalName.trim() ? body.originalName : "image";
  const sizeBytes = Number(body.sizeBytes) || 0;
  if (!originalUrl) return res.status(400).json({ error: "missing_original" });

  // 1. credit pre-check — fail before spending a paid ClipDrop credit
  const { data: stats } = await supabase
    .from("user_stats")
    .select("plan, credits_remaining")
    .eq("id", user.id)
    .maybeSingle();
  const plan = stats?.plan ?? "free";
  const credits = Number(stats?.credits_remaining ?? 0);
  if (plan !== "pro" && credits <= 0) return res.status(402).json({ error: "no_credits" });

  // 2. fetch original bytes → ClipDrop
  const srcResp = await fetch(originalUrl);
  if (!srcResp.ok) return res.status(400).json({ error: "original_fetch_failed", detail: `source ${srcResp.status}` });
  const inputBuffer = Buffer.from(await srcResp.arrayBuffer());

  const form = new FormData();
  form.append("image_file", new Blob([inputBuffer]), originalName);

  const clip = await fetch(CLIPDROP_URL, {
    method: "POST",
    headers: { "x-api-key": process.env.CLIPDROP_API_KEY as string },
    body: form,
  });
  if (!clip.ok) {
    let code = "clipdrop_error";
    if (clip.status === 402) code = "clipdrop_out_of_credits";
    else if (clip.status === 429) code = "rate_limited";
    else if (clip.status === 400) code = "clipdrop_bad_image";
    return res.status(502).json({ error: code, detail: `clipdrop ${clip.status}` });
  }
  const resultBuffer = Buffer.from(await clip.arrayBuffer());

  // 3. upload transparent PNG result to Cloudinary (signed, server-side)
  let resultUrl: string;
  let resultPublicId: string;
  try {
    const uploaded = await getCloudinary().uploader.upload(
      `data:image/png;base64,${resultBuffer.toString("base64")}`,
      { folder: `snapcut/results/${user.id}`, resource_type: "image", format: "png" }
    );
    resultUrl = uploaded.secure_url;
    resultPublicId = uploaded.public_id;
  } catch (e) {
    return res.status(502).json({ error: "cloudinary_upload_failed", detail: (e as Error).message });
  }

  // 4. persist history row (non-fatal if it fails — user still gets their image)
  const { data: row, error: insErr } = await supabase
    .from("uploads")
    .insert({
      user_id: user.id,
      original_name: originalName,
      size_bytes: sizeBytes || inputBuffer.length,
      result_url: resultUrl,
      result_public_id: resultPublicId,
      original_url: originalUrl,
      original_public_id: originalPublicId,
    })
    .select("id")
    .single();
  if (insErr) console.error("uploads insert failed:", insErr.message);

  // 5. consume one credit (atomic RPC, runs as the user)
  const { data: consume, error: rpcErr } = await supabase.rpc("consume_image_credit");
  if (rpcErr) console.error("consume_image_credit failed:", rpcErr.message);

  return res.status(200).json({
    url: resultUrl,
    id: row?.id ?? null,
    stats: (consume as { stats?: unknown } | null)?.stats ?? null,
  });
}
