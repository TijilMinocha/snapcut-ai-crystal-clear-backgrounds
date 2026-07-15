import { supabase } from "@/lib/supabase";
import { uploadOriginalToCloudinary } from "@/lib/cloudinary";

export interface RemoveBgResult {
  url: string;
  id: string | null;
}

/**
 * Full background-removal flow from the browser's point of view:
 *   1. push the original to Cloudinary
 *   2. call our /api/remove-bg function, which runs ClipDrop, stores the
 *      result, records history and consumes a credit — all server-side.
 *
 * Throws Error("no_credits") specifically so the UI can show the upgrade path.
 */
export async function removeBackground(file: File): Promise<RemoveBgResult> {
  const { data: sessionData } = await supabase.auth.getSession();
  const session = sessionData.session;
  if (!session) throw new Error("You need to be signed in to remove backgrounds.");

  const original = await uploadOriginalToCloudinary(file);

  const resp = await fetch("/api/remove-bg", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      originalUrl: original.url,
      originalPublicId: original.publicId,
      originalName: file.name,
      sizeBytes: file.size,
    }),
  });

  const data = (await resp.json().catch(() => ({}))) as Record<string, unknown>;

  if (!resp.ok) {
    const code = typeof data.error === "string" ? data.error : "";
    const detail = typeof data.detail === "string" ? data.detail : "";
    throw new Error(mapError(code, detail));
  }

  return { url: data.url as string, id: (data.id as string) ?? null };
}

function mapError(code: string, detail: string): string {
  switch (code) {
    case "no_credits":
      return "no_credits";
    case "clipdrop_out_of_credits":
      return "The background-removal service has run out of credits. Please contact support.";
    case "rate_limited":
      return "Too many requests right now. Please wait a few seconds and try again.";
    case "clipdrop_bad_image":
      return "That image couldn't be processed. Try a different JPG, PNG, or WEBP.";
    case "unauthorized":
      return "Your session expired. Please sign in again.";
    case "server_misconfigured":
      return "The service isn't fully configured yet. Please try again shortly.";
    default:
      return detail || "Failed to remove the background. Please try again.";
  }
}
