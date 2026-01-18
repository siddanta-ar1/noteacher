import { createServerSupabaseClient } from "@/lib/supabase-server";

import { redirect } from "next/navigation";

import LeaderboardClient from "./LeaderboardClient";

export const dynamic = "force-dynamic"; // Ensure leaderboard is always live

export default async function LeaderboardPage() {
  const supabase = await createServerSupabaseClient();

  // 1. Auth Check

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 2. Fetch Leaderboard Data from our View

  const { data: leaderboard, error } = await supabase

    .from("leaderboard")

    .select("*")

    .order("ranking", { ascending: true })

    .limit(50); // Top 50

  if (error) {
    console.error("Leaderboard Error:", error);

    return (
      <div className="flex items-center justify-center min-h-screen text-slate-500">
        Failed to load rankings. Please try again.
      </div>
    );
  }

  return <LeaderboardClient data={leaderboard || []} currentUserId={user.id} />;
}
