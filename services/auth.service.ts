"use server";

import { createServerSupabaseClient } from "@/lib/supabase-server";
import { createAdminSupabaseClient } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createProfile } from "./profile.service";
import { sendConfirmationEmail } from "./email.service";
import { getSiteUrl } from "@/lib/utils/url";
import type { ServiceResult } from "@/types";

/**
 * Sign in with email and password
 */
export async function login(
    formData: FormData
): Promise<ServiceResult<boolean>> {
    const email = formData.get("email");
    const password = formData.get("password");

    // Input validation
    if (!email || typeof email !== "string" || !email.includes("@")) {
        return { data: null, error: "Please enter a valid email address" };
    }
    if (!password || typeof password !== "string" || password.length < 6) {
        return { data: null, error: "Password must be at least 6 characters" };
    }

    try {
        const supabase = await createServerSupabaseClient();
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return { data: null, error: error.message };
        }

        revalidatePath("/", "layout");
        redirect("/home");
    } catch (err) {
        // redirect throws an error, so we need to rethrow it
        throw err;
    }
}

/**
 * Sign up with email and password (no email verification)
 */
export async function signup(
    formData: FormData
): Promise<ServiceResult<{ needsConfirmation: boolean }>> {
    const email = formData.get("email");
    const password = formData.get("password");
    const fullName = formData.get("fullName");
    const username = formData.get("username");

    // Input validation
    if (!email || typeof email !== "string" || !email.includes("@")) {
        return { data: null, error: "Please enter a valid email address" };
    }
    if (!password || typeof password !== "string" || password.length < 8) {
        return { data: null, error: "Password must be at least 8 characters" };
    }
    if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
        return { data: null, error: "Please enter your full name" };
    }
    if (!username || typeof username !== "string" || username.trim().length < 3) {
        return { data: null, error: "Username must be at least 3 characters" };
    }

    // Validate username format (alphanumeric + underscore only)
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return { data: null, error: "Username can only contain letters, numbers, and underscores" };
    }

    try {
        const adminSupabase = createAdminSupabaseClient();

        // Check if username is already taken
        const { data: existingUser } = await adminSupabase
            .from("profiles")
            .select("username")
            .eq("username", username.toLowerCase())
            .single();

        if (existingUser) {
            return { data: null, error: "Username is already taken" };
        }

        // Create user directly with admin client (bypasses email confirmation)
        const { data: userData, error: createError } = await adminSupabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // Auto-confirm email
            user_metadata: {
                full_name: fullName,
                username: username.toLowerCase(),
            },
        });

        if (createError) {
            return { data: null, error: createError.message };
        }

        const { user } = userData;

        // Create profile for new user
        if (user) {
            await adminSupabase.from("profiles").insert({
                id: user.id,
                full_name: fullName,
                username: username.toLowerCase(),
                role: "user",
            });
        }

        // Now sign in the user so they're logged in immediately
        const supabase = await createServerSupabaseClient();
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (signInError) {
            return { data: null, error: signInError.message };
        }

        revalidatePath("/", "layout");
        redirect("/home");
    } catch (err) {
        // redirect throws an error, so we need to rethrow it
        if ((err as Error).message === "NEXT_REDIRECT") {
            throw err;
        }
        console.error("signup error:", err);
        return { data: null, error: (err as Error).message };
    }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
    redirect("/login");
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser() {
    const supabase = await createServerSupabaseClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    return user;
}

/**
 * Require authenticated user or redirect to login
 */
export async function requireUser() {
    const user = await getCurrentUser();
    if (!user) {
        redirect("/login");
    }
    return user;
}

/**
 * Require user with completed onboarding
 */
export async function requireOnboarding() {
    const user = await requireUser();
    const supabase = await createServerSupabaseClient();

    const { data: profile } = await supabase
        .from("profiles")
        .select("interests")
        .eq("id", user.id)
        .single();

    // Force onboarding if no interests
    if (
        !profile?.interests ||
        (Array.isArray(profile.interests) && profile.interests.length === 0)
    ) {
        redirect("/interest");
    }

    return user;
}
