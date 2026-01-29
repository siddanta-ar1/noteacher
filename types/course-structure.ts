export type ContentBlockType =
    | "text"
    | "image"
    | "quiz"
    | "simulation"
    | "assignment"
    | "divider"
    | "ai-insight"
    | "animation";

export interface Citation {
    id: string;
    text: string;
    url?: string;
}

export interface BaseBlock {
    id: string;
    type: ContentBlockType;
    citations?: Citation[];
    [key: string]: any;
}

export interface SubTopic {
    id: string;
    title: string;
    blocks: BaseBlock[];
}

export interface Topic {
    id: string;
    title: string;
    description?: string;
    subTopics: SubTopic[]; // Or direct blocks if no sub-segmentation
    // If we map to current DB node:
    position_index?: number;
}

export interface World {
    id: string;
    title: string;
    description: string;
    topics: Topic[];
}

export interface CourseStructure {
    worlds: World[];
}
