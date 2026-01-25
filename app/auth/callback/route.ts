import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // Ensure we don't redirect to an arbitrary domain
  const next = searchParams.get("next") ?? "/home";

  if (code) {
    const cookieStore = await cookies();

    // Create the success response upfront so we can modify its cookies
    const successResponse = NextResponse.redirect(`${origin}${next}`);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              // 1. Set in the global store (for Next.js internals)
              cookieStore.set(name, value, options);
              // 2. Set on the explicit response object (to ensure they persist on redirect)
              successResponse.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      console.log("[Auth Callback] Success! Redirecting to:", next);
      return successResponse;
    } else {
      console.error("[Auth Callback] Exchange Error:", error);
    }
  } else {
    console.error("[Auth Callback] No code provided");
  }

  // Return the user to an error page with instructions
  console.log("[Auth Callback] Redirecting to error page");
  return NextResponse.redirect(`${origin}/login?error=auth-code-error`);
}
