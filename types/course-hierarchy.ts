import { ContentBlock } from './content';

// --------------------------------------------------------
// New 3-Layer Hierarchy
// --------------------------------------------------------

export interface CourseHierarchy {
    courseTitle: string;
    courseDescription?: string;
    levels: CourseLevel[];
}

export interface CourseLevel {
    id: string;
    title: string;
    description?: string;
    topics: CourseTopic[];
}

export interface CourseTopic {
    id: string;
    title: string;
    description?: string;
    // Topics contain Subtopics (the actual lessons)
    subtopics: CourseSubtopic[];
    // Assignments can be at the topic level (e.g., "End of Topic Assignment")
    topicAssignment?: HierarchyAssignment;
}

export interface CourseSubtopic {
    id: string;
    title: string;
    description?: string;
    // This essentially maps to a "Lesson" or "Node" in the DB
    blocks: ContentBlock[];
    // Pre-generated AI summary for this specific page/subtopic
    aiSummary?: string;
    // Context for the AI teacher about this specific page
    teacherContext?: string;
}

// --------------------------------------------------------
// Enhanced Assignment & Animation Types
// --------------------------------------------------------

export interface HierarchyAssignment {
    title: string;
    instructions: string;
    type: 'quiz' | 'project' | 'writing';
    questions?: HierarchyQuestion[]; // For quizzes
}

export interface HierarchyQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
}

// Note: The existing 'AnimationBlock' in content.ts is good, 
// but we explicitly want to support Supabase storage paths.
export interface SupabaseAnimation {
    bucketPath: string; // e.g., "animations/level1/topic2/intro.mp4"
    platform: 'supabase';
    autoplay?: boolean;
}
