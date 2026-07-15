const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export interface CloudinaryUpload {
  url: string;
  publicId: string;
}

/**
 * Upload the ORIGINAL image straight from the browser to Cloudinary using an
 * unsigned upload preset. Doing this client-side keeps the (potentially large)
 * file off our serverless function, which caps request bodies at ~4.5 MB.
 */
export async function uploadOriginalToCloudinary(file: File): Promise<CloudinaryUpload> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error("Image uploads aren't configured yet (missing VITE_CLOUDINARY_* env vars).");
  }

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", UPLOAD_PRESET);
  form.append("folder", "snapcut/originals");

  const resp = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: form,
  });

  if (!resp.ok) {
    let detail = "";
    try {
      detail = (await resp.json())?.error?.message ?? "";
    } catch {
      /* ignore */
    }
    throw new Error(`Upload failed${detail ? `: ${detail}` : ""}`);
  }

  const data = await resp.json();
  return { url: data.secure_url as string, publicId: data.public_id as string };
}
