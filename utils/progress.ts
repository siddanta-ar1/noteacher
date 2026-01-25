// Pure utility functions for progress calculations (no "use server")
import type { UserProgress } from "@/types";
import { XP_PER_NODE } from "@/config/constants";

/**
 * Calculate XP from completed nodes
 */
export function calculateXP(progress: UserProgress[]): number {
    const completedCount = progress.filter((p) => p.status === "completed").length;
    return completedCount * XP_PER_NODE;
}

/**
 * Calculate streak from activity dates
 */
export function calculateStreak(progress: UserProgress[]): number {
    if (!progress || progress.length === 0) return 0;

    const uniqueDays = new Set(
        progress.map((p) => {
            const d = p.updated_at || new Date().toISOString();
            return new Date(d).toDateString();
        })
    );

    return Math.max(1, uniqueDays.size);
}

/**
 * Get completed node IDs
 */
export function getCompletedNodeIds(progress: UserProgress[]): Set<string> {
    return new Set(
        progress.filter((p) => p.status === "completed").map((p) => p.node_id)
    );
}
