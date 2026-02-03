// Database types for NOTEacher
// These should be regenerated using `supabase gen types typescript` when schema changes

export type NodeType = 'lesson' | 'assignment' | 'simulator';
export type ProgressStatus = 'locked' | 'unlocked' | 'current' | 'completed';
export type UserRole = 'user' | 'admin';

// ============ BASE TYPES ============

export interface Course {
    id: string;
    title: string;
    description: string | null;
    thumbnail_url: string | null;
    created_at: string;
}

export interface Node {
    id: string;
    course_id: string;
    mission_id?: string; // Links node to mission in hierarchy
    title: string;
    type: NodeType;
    is_mandatory: boolean;
    content_json: LessonContent | null;
    content: Record<string, unknown>;
    position_index: number;
}

export interface Level {
    id: string;
    course_id: string;
    title: string;
    description?: string;
    position_index: number;
    created_at?: string;
    updated_at?: string;
}

export interface Mission {
    id: string;
    level_id: string;
    title: string;
    description?: string;
    position_index: number;
    created_at?: string;
    updated_at?: string;
}

export interface Profile {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    interests: string[];
    wallet_balance: number;
    role: UserRole;
    updated_at: string;
    created_at: string;
    email?: string;
}

export interface UserProgress {
    user_id: string;
    node_id: string;
    status: ProgressStatus;
    updated_at?: string;
}

// ============ CONTENT TYPES ============

export interface LessonBlock {
    id: string;
    type: 'text' | 'simulation' | 'quiz' | 'image' | 'assignment';
    content?: string;
    data?: QuizData | SimulationData | AssignmentData;
}

export interface QuizData {
    options: string[];
    correctIndex: number;
}

export interface SimulationData {
    type: 'logic-gates' | 'statistics';
    mode?: string;
}

export interface AssignmentData {
    title: string;
    instructions?: string;
}

export interface LessonContent {
    segments?: string[];
    task?: string;
    visualizerMode?: string;
    blocks?: LessonBlock[];
}

// ============ JOIN TYPES ============

export interface CourseWithNodes extends Course {
    nodes: Node[];
}

export interface CourseWithNodeCount extends Course {
    nodes: { count: number }[];
}

export interface NodeWithProgress extends Node {
    status: ProgressStatus;
}

// ============ HIERARCHY JOIN TYPES ============

export interface MissionWithNodes extends Mission {
    nodes: Node[];
}

export interface LevelWithMissions extends Level {
    missions: MissionWithNodes[];
}

export interface CourseWithHierarchy extends Course {
    levels: LevelWithMissions[];
}

// ============ LEADERBOARD ============

export interface LeaderboardEntry {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    xp: number;
    ranking: number;
}

// ============ API RESPONSE TYPES ============

export interface ServiceResult<T> {
    data: T | null;
    error: string | null;
}
