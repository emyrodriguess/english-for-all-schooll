import "server-only";

import { requireActiveAdmin } from "@/lib/internal/auth";

export async function createSignedFileUrl(bucket: string, key: string | null) {
  if (!key) return null;
  const { supabase } = await requireActiveAdmin();
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(key, 300);
  return error ? null : data.signedUrl;
}
