/**
 * Format XP with commas
 */
export function formatXP(xp: number): string {
    return xp.toLocaleString();
}

/**
 * Format percentage
 */
export function formatPercent(value: number): string {
    return `${Math.round(value)}%`;
}

/**
 * Get first name from full name
 */
export function getFirstName(fullName: string | null | undefined): string {
    if (!fullName) return "Cadet";
    return fullName.split(" ")[0] || "Cadet";
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, length: number): string {
    if (text.length <= length) return text;
    return text.slice(0, length) + "...";
}
