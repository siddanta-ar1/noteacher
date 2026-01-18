import { createBrowserClient } from "@supabase/ssr";

// Create a single instance to be used throughout the client
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
