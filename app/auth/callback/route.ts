import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server"; // Ensure this import path is correct

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // Default to /home, but we can pass ?next=/interest in the login page later
  const next = searchParams.get("next") ?? "/home";

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth-code-error`);
}
