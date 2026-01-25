"use server";

import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function saveInterests(interests: string[]) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await supabase
      .from("profiles")
      .update({ interests: interests }) // Assumes 'interests' is a jsonb column
      .eq("id", user.id);
  }
}
