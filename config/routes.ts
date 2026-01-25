// Route definitions to avoid magic strings

export const ROUTES = {
    // Public
    LANDING: '/',
    LOGIN: '/login',

    // Auth
    AUTH_CALLBACK: '/auth/callback',

    // Onboarding
    INTEREST: '/interest',

    // Dashboard
    HOME: '/home',
    COURSES: '/courses',
    LEADERBOARD: '/leaderboard',
    PROFILE: '/profile',
    SIMULATOR: '/simulator',

    // Dynamic
    course: (courseId: string) => `/course/${courseId}`,
    lesson: (nodeId: string) => `/lesson/${nodeId}`,
} as const;

// Routes that don't show the sidebar (immersive mode)
export const IMMERSIVE_ROUTES = [
    ROUTES.LANDING,
    ROUTES.LOGIN,
    ROUTES.INTEREST,
    ROUTES.SIMULATOR,
] as const;

// Patterns for immersive routes (for matching dynamic routes)
export const IMMERSIVE_PATTERNS = [
    '/lesson',
] as const;

// Check if a route is immersive
export function isImmersiveRoute(pathname: string): boolean {
    if (IMMERSIVE_ROUTES.includes(pathname as typeof IMMERSIVE_ROUTES[number])) {
        return true;
    }
    return IMMERSIVE_PATTERNS.some(pattern => pathname.startsWith(pattern));
}

// Public routes (accessible without auth)
export const PUBLIC_ROUTES = [
    ROUTES.LANDING,
    ROUTES.LOGIN,
    ROUTES.AUTH_CALLBACK,
] as const;

// Check if a route is public
export function isPublicRoute(pathname: string): boolean {
    if (PUBLIC_ROUTES.includes(pathname as typeof PUBLIC_ROUTES[number])) {
        return true;
    }
    return pathname.startsWith('/auth') || pathname.startsWith('/public');
}
