# Supabase schema

This folder is the version-controlled source of truth for the database.

## What already exists in the remote project (not in this repo yet)

These were created earlier (by the original vibe-coded build) and live only
in the hosted Supabase project `opedfqsrfjfaymcrswuk`:

- **`auth.users`** — managed by Supabase Auth.
- **`public.user_stats`** — one row per user: `plan` (`free` | `pro`),
  `credits_remaining`, `total_images_processed`, `monthly_images_processed`,
  `month_key`, `updated_at`.
- **`consume_image_credit()`** — Postgres RPC that atomically decrements a
  credit and returns `{ ok, error?, stats }`. Called by the app (and now by
  `/api/remove-bg`) after a successful background removal.

To pull these into this folder so the whole schema is reproducible:

```bash
npx supabase login
npx supabase link --project-ref opedfqsrfjfaymcrswuk
npx supabase db pull          # writes the existing schema as a migration
```

## Applying the new migration

`migrations/0001_uploads_history.sql` adds the `uploads` table (persistent,
per-account history). Apply it either way:

- **Quick:** paste the file into the Supabase Dashboard → SQL Editor → Run.
- **CLI:** `npx supabase db push` (after linking, as above).

## Storage

Images are **not** stored in Supabase Storage — they live in Cloudinary.
The `uploads` table only keeps the Cloudinary URLs and `public_id`s.
