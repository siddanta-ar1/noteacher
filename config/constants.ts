// Application constants

// ============ GAMIFICATION ============

export const XP_PER_NODE = 150;
export const STREAK_BONUS_MULTIPLIER = 1.5;

// ============ NODE TYPES ============

export const NODE_TYPES = {
    LESSON: 'lesson',
    ASSIGNMENT: 'assignment',
    SIMULATOR: 'simulator',
} as const;

// ============ PROGRESS STATUSES ============

export const PROGRESS_STATUSES = {
    LOCKED: 'locked',
    UNLOCKED: 'unlocked',
    COMPLETED: 'completed',
} as const;

// ============ USER ROLES ============

export const USER_ROLES = {
    USER: 'user',
    ADMIN: 'admin',
} as const;

// ============ INTEREST OPTIONS ============

export const INTERESTS = [
    { id: 'cs', label: 'Computer Science', icon: 'Code' },
    { id: 'ee', label: 'Electrical Eng.', icon: 'Zap' },
    { id: 'mech', label: 'Mechanical', icon: 'Cpu' },
    { id: 'civil', label: 'Civil Eng.', icon: 'Globe' },
] as const;

// ============ COURSE ICON MAPPING ============

export const COURSE_ICONS: Record<string, string> = {
    Logic: 'Zap',
    Architecture: 'Trophy',
    'RISC-V': 'Star',
    Default: 'BookOpen',
};

// ============ AI TUTOR ============

export const AI_SYSTEM_PROMPT = `
You are an elite engineering tutor named "NOTEacher AI".
Explain complex engineering concepts simply using analogies.

RULES:
1. Keep answers under 3 sentences unless asked.
2. Use emojis occasionally.
3. Never give direct quiz answers; guide instead.
`;
