"use server";

import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { Profile, ServiceResult } from "@/types";

/**
 * Get current user's profile
 */
export async function getProfile(): Promise<ServiceResult<Profile>> {
    try {
        const supabase = await createServerSupabaseClient();

        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
            return { data: null, error: "Unauthorized" };
        }

        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

        if (error) throw error;

        const profileWithEmail: Profile = {
            ...data,
            email: user.email,
        };

        return { data: profileWithEmail, error: null };
    } catch (err) {
        console.error("getProfile error:", err);
        return { data: null, error: (err as Error).message };
    }
}

/**
 * Get profile by user ID
 */
export async function getProfileById(
    userId: string
): Promise<ServiceResult<Profile>> {
    try {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();

        if (error) throw error;
        return { data: data as Profile, error: null };
    } catch (err) {
        console.error("getProfileById error:", err);
        return { data: null, error: (err as Error).message };
    }
}

/**
 * Update profile
 */
export async function updateProfile(
    updates: Partial<Pick<Profile, "full_name" | "avatar_url">>
): Promise<ServiceResult<Profile>> {
    try {
        const supabase = await createServerSupabaseClient();

        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
            return { data: null, error: "Unauthorized" };
        }

        const { data, error } = await supabase
            .from("profiles")
            .update({
                ...updates,
                updated_at: new Date().toISOString(),
            })
            .eq("id", user.id)
            .select()
            .single();

        if (error) throw error;
        return { data: data as Profile, error: null };
    } catch (err) {
        console.error("updateProfile error:", err);
        return { data: null, error: (err as Error).message };
    }
}

/**
 * Save user interests during onboarding
 */
export async function saveInterests(
    interests: string[]
): Promise<ServiceResult<boolean>> {
    try {
        const supabase = await createServerSupabaseClient();

        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
            return { data: null, error: "Unauthorized" };
        }

        const { error } = await supabase
            .from("profiles")
            .update({ interests })
            .eq("id", user.id);

        if (error) throw error;
        return { data: true, error: null };
    } catch (err) {
        console.error("saveInterests error:", err);
        return { data: null, error: (err as Error).message };
    }
}

/**
 * Create profile for new user
 */
export async function createProfile(
    userId: string,
    fullName: string | null
): Promise<ServiceResult<Profile>> {
    try {
        const supabase = await createServerSupabaseClient();

        const { data, error } = await supabase
            .from("profiles")
            .insert({
                id: userId,
                full_name: fullName,
                role: "user",
            })
            .select()
            .single();

        if (error) throw error;
        return { data: data as Profile, error: null };
    } catch (err) {
        console.error("createProfile error:", err);
        return { data: null, error: (err as Error).message };
    }
}
