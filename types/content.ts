// types/content.ts
// JSON Content Schema Types for the Learning Platform

export type ContentBlockType =
    | "text"
    | "image"
    | "quiz"
    | "simulation"
    | "assignment"
    | "divider"
    | "ai-insight"
    | "animation";

// Animation configuration for blocks
export interface AnimationConfig {
    type: "fade" | "slide" | "scale" | "parallax";
    direction?: "up" | "down" | "left" | "right";
    delay?: number;
    duration?: number;
}

// Base block interface
interface BaseBlock {
    id: string;
    type: ContentBlockType;
    animation?: AnimationConfig;
}

// Text Block - supports Markdown
export interface Citation {
    id: string;
    text: string;
    url?: string;
}

export interface TextBlock extends BaseBlock {
    type: "text";
    content: string;
    style?: "default" | "callout" | "quote" | "highlight" | "heading";
    citations?: Citation[];
}

// Image Block
export interface ImageBlock extends BaseBlock {
    type: "image";
    url: string;
    alt?: string;
    caption?: string;
    size?: "small" | "medium" | "large" | "full";
}

// Quiz Block
export interface QuizBlock extends BaseBlock {
    type: "quiz";
    question: string;
    options: string[];
    correctIndex: number;
    explanation?: string;
    unlocks?: boolean; // Does completing this unlock next section?
}

// Simulation Registry Type - open string for IDs
export interface SimulationBlock extends BaseBlock {
    type: "simulation";
    simulationId: string; // Updated from enum to string for registry pattern
    config?: Record<string, unknown>;
    instructions?: string;
}

// Assignment Block
export type SubmissionType = "text" | "photo" | "audio";

export interface AssignmentBlock extends BaseBlock {
    type: "assignment";
    assignmentId?: string; // Optional - can be inline or reference DB
    title: string;
    description?: string;
    instructions?: string;
    submissionTypes: SubmissionType[];
    isBlocking?: boolean; // Must complete to proceed
    maxFileSize?: number; // In MB
}

// Divider Block
export interface DividerBlock extends BaseBlock {
    type: "divider";
    style?: "line" | "space" | "section-break";
}

// AI Insight Block
export interface AIInsightBlock extends BaseBlock {
    type: "ai-insight";
    prompt?: string; // Custom prompt for this section
    showSummary?: boolean;
    showSimulation?: boolean;
    context?: string; // Optional context to pass to AI
}

// Animation Block (Video or Lottie)
export interface AnimationBlock extends BaseBlock {
    type: "animation";
    format: "video" | "lottie";
    url: string; // Remote URL
    autoplay?: boolean;
    loop?: boolean;
    caption?: string;
    height?: number; // Optional height constraint
}

// Union type of all content blocks
export type ContentBlock =
    | TextBlock
    | ImageBlock
    | QuizBlock
    | SimulationBlock
    | AssignmentBlock
    | DividerBlock
    | AIInsightBlock
    | AnimationBlock;

// Course Content JSON - the main schema
export interface CourseContentJSON {
    version: "1.0";
    metadata?: ContentMetadata;
    blocks: ContentBlock[];
}

export interface ContentMetadata {
    estimatedMinutes?: number;
    difficulty?: "beginner" | "intermediate" | "advanced";
    tags?: string[];
    objectives?: string[];
    prerequisites?: string[];
}

// Assignment from database
export interface Assignment {
    id: string;
    node_id: string;
    title: string;
    instructions?: string;
    submission_types: SubmissionType[];
    is_required: boolean;
    max_file_size_mb: number;
    created_at: string;
    updated_at: string;
}

// Submission types
export type SubmissionStatus = "pending" | "reviewed" | "approved" | "rejected";

export interface Submission {
    id: string;
    assignment_id: string;
    user_id: string;
    submission_type: SubmissionType;
    text_content?: string;
    file_url?: string;
    file_name?: string;
    ai_feedback?: string;
    ai_score?: number;
    status: SubmissionStatus;
    submitted_at: string;
    reviewed_at?: string;
}

// AI Summary cached in database
export interface AISummary {
    id: string;
    node_id: string;
    section_index: number;
    summary_text: string;
    generated_at: string;
}
