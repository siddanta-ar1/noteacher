import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export async function requireUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function requireOnboarding() {
  const user = await requireUser();
  const supabase = await createServerSupabaseClient();

  // Fetch Profile to check if they have completed onboarding
  const { data: profile } = await supabase
    .from("profiles")
    .select("interests")
    .eq("id", user.id)
    .single();

  // If interests is null or empty array, force them to /interest
  if (
    !profile?.interests ||
    (Array.isArray(profile.interests) && profile.interests.length === 0)
  ) {
    redirect("/interest");
  }

  return user;
}
