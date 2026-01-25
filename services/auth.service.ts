"use server";

import { createServerSupabaseClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createProfile } from "./profile.service";
import type { ServiceResult } from "@/types";

/**
 * Sign in with email and password
 */
export async function login(
    formData: FormData
): Promise<ServiceResult<boolean>> {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

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
 * Sign up with email and password
 */
export async function signup(
    formData: FormData
): Promise<ServiceResult<{ needsConfirmation: boolean }>> {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;

    try {
        const supabase = await createServerSupabaseClient();

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        });

        if (error) {
            return { data: null, error: error.message };
        }

        // Create profile for new user
        if (data.user) {
            await createProfile(data.user.id, fullName);
        }

        return { data: { needsConfirmation: true }, error: null };
    } catch (err) {
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
