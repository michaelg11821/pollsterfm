import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

/**
 * Returns the file name in a Supabase Storage resource.
 *
 * @param supabaseUrl A URL to a Supabase Storage resource.
 * @returns The name of a file in (public) Supabase Storage.
 */
export function getSupabaseFileName(supabaseUrl: URL) {
  const pathnames = supabaseUrl.pathname.split("/");
  const fileName = pathnames[pathnames.length - 1];

  return fileName;
}
