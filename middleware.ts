import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // 1. Initialize Supabase Client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // 2. Check Auth Status
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 3. Define Route Rules
  const url = new URL(request.url);
  const nextUrl = request.nextUrl.pathname;

  // Public Routes (Accessible by anyone)
  const isPublic =
    nextUrl === "/" ||
    nextUrl === "/login" ||
    nextUrl.startsWith("/auth") ||
    nextUrl.startsWith("/public"); // for assets if needed

  // If NOT Logged In + Trying to access Private Route -> Redirect to Login
  if (!user && !isPublic) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // If Logged In + Trying to access Login/Landing -> Redirect to Home
  if (user && (nextUrl === "/login" || nextUrl === "/")) {
    url.pathname = "/home";
    return NextResponse.redirect(url);
  }

  // Allow the request to proceed
  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
