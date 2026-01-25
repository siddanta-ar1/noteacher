// lib/content-parser.ts
// JSON Content Engine with graceful fallbacks

import type {
    CourseContentJSON,
    ContentBlock,
    TextBlock,
    ImageBlock,
    QuizBlock,
    SimulationBlock,
    AssignmentBlock,
    DividerBlock,
    AIInsightBlock,
    ContentBlockType,
    AnimationConfig,
} from "@/types/content";

/**
 * Default empty content structure
 */
const DEFAULT_CONTENT: CourseContentJSON = {
    version: "1.0",
    metadata: {},
    blocks: [],
};

/**
 * Parse raw JSON into validated CourseContentJSON
 * Handles missing/malformed data gracefully
 */
export function parseContentJSON(raw: unknown): CourseContentJSON {
    if (!raw || typeof raw !== "object") {
        console.warn("[ContentParser] Invalid content, returning defaults");
        return DEFAULT_CONTENT;
    }

    const content = raw as Partial<CourseContentJSON>;

    // Handle legacy format (segments array)
    if ("segments" in raw && Array.isArray((raw as any).segments)) {
        return migrateLegacyFormat(raw as any);
    }

    // Handle blocks array
    if ("blocks" in raw && Array.isArray((raw as any).blocks)) {
        const parsedBlocks = (raw as any).blocks
            .map(parseBlock)
            .filter((b: ContentBlock | null): b is ContentBlock => b !== null);

        return {
            version: content.version || "1.0",
            metadata: content.metadata || {},
            blocks: parsedBlocks,
        };
    }

    return DEFAULT_CONTENT;
}

/**
 * Migrate legacy segment-based format to new block-based format
 */
function migrateLegacyFormat(legacy: {
    segments?: string[];
    task?: string;
    visualizerMode?: string;
}): CourseContentJSON {
    const blocks: ContentBlock[] = [];

    // Convert segments to text blocks
    if (legacy.segments) {
        legacy.segments.forEach((segment, index) => {
            blocks.push({
                id: `legacy-text-${index}`,
                type: "text",
                content: segment,
                style: index === 0 ? "heading" : "default",
            });
        });
    }

    // Convert task to text block
    if (legacy.task) {
        blocks.push({
            id: "legacy-task",
            type: "text",
            content: legacy.task,
            style: "callout",
        });
    }

    // Convert visualizerMode to simulation block
    if (legacy.visualizerMode) {
        blocks.push({
            id: "legacy-sim",
            type: "simulation",
            simulationType: legacy.visualizerMode as any || "statistics",
        });
    }

    return {
        version: "1.0",
        metadata: {},
        blocks,
    };
}

/**
 * Parse a single block with type-specific validation
 */
function parseBlock(block: unknown): ContentBlock | null {
    if (!block || typeof block !== "object") {
        return null;
    }

    const b = block as Record<string, unknown>;

    // Validate required fields
    if (!b.id || typeof b.id !== "string") {
        console.warn("[ContentParser] Block missing id:", block);
        return null;
    }

    if (!b.type || typeof b.type !== "string") {
        console.warn("[ContentParser] Block missing type:", block);
        return null;
    }

    const baseBlock = {
        id: b.id,
        animation: parseAnimation(b.animation),
    };

    // Type-specific parsing
    switch (b.type as ContentBlockType) {
        case "text":
            return parseTextBlock(b, baseBlock);

        case "image":
            return parseImageBlock(b, baseBlock);

        case "quiz":
            return parseQuizBlock(b, baseBlock);

        case "simulation":
            return parseSimulationBlock(b, baseBlock);

        case "assignment":
            return parseAssignmentBlock(b, baseBlock);

        case "divider":
            return parseDividerBlock(b, baseBlock);

        case "ai-insight":
            return parseAIInsightBlock(b, baseBlock);

        default:
            console.warn(`[ContentParser] Unknown block type: ${b.type}`);
            return null;
    }
}

function parseAnimation(anim: unknown): AnimationConfig | undefined {
    if (!anim || typeof anim !== "object") return undefined;

    const a = anim as Record<string, unknown>;
    const validTypes = ["fade", "slide", "scale", "parallax"];
    const validDirections = ["up", "down", "left", "right"];

    if (!validTypes.includes(a.type as string)) return undefined;

    return {
        type: a.type as AnimationConfig["type"],
        direction: validDirections.includes(a.direction as string)
            ? (a.direction as AnimationConfig["direction"])
            : undefined,
        delay: typeof a.delay === "number" ? a.delay : undefined,
        duration: typeof a.duration === "number" ? a.duration : undefined,
    };
}

function parseTextBlock(
    b: Record<string, unknown>,
    base: { id: string; animation?: AnimationConfig }
): TextBlock {
    const validStyles = ["default", "callout", "quote", "highlight", "heading"];
    return {
        ...base,
        type: "text",
        content: String(b.content || ""),
        style: validStyles.includes(b.style as string)
            ? (b.style as TextBlock["style"])
            : "default",
    };
}

function parseImageBlock(
    b: Record<string, unknown>,
    base: { id: string; animation?: AnimationConfig }
): ImageBlock {
    const validSizes = ["small", "medium", "large", "full"];
    return {
        ...base,
        type: "image",
        url: String(b.url || ""),
        alt: b.alt ? String(b.alt) : undefined,
        caption: b.caption ? String(b.caption) : undefined,
        size: validSizes.includes(b.size as string)
            ? (b.size as ImageBlock["size"])
            : "large",
    };
}

function parseQuizBlock(
    b: Record<string, unknown>,
    base: { id: string; animation?: AnimationConfig }
): QuizBlock {
    return {
        ...base,
        type: "quiz",
        question: String(b.question || "Question?"),
        options: Array.isArray(b.options)
            ? b.options.map((o) => String(o))
            : ["Option A", "Option B"],
        correctIndex: typeof b.correctIndex === "number" ? b.correctIndex : 0,
        explanation: b.explanation ? String(b.explanation) : undefined,
        unlocks: b.unlocks === true,
    };
}

function parseSimulationBlock(
    b: Record<string, unknown>,
    base: { id: string; animation?: AnimationConfig }
): SimulationBlock {
    const validTypes = [
        "logic-gates",
        "statistics",
        "circuit",
        "number-line",
        "probability",
        "custom",
    ];
    return {
        ...base,
        type: "simulation",
        simulationType: validTypes.includes(b.simulationType as string)
            ? (b.simulationType as SimulationBlock["simulationType"])
            : "custom",
        config:
            b.config && typeof b.config === "object"
                ? (b.config as Record<string, unknown>)
                : undefined,
        instructions: b.instructions ? String(b.instructions) : undefined,
    };
}

function parseAssignmentBlock(
    b: Record<string, unknown>,
    base: { id: string; animation?: AnimationConfig }
): AssignmentBlock {
    const validSubmissionTypes = ["text", "photo", "audio"];
    const submissionTypes = Array.isArray(b.submissionTypes)
        ? b.submissionTypes.filter((t) => validSubmissionTypes.includes(t))
        : ["text"];

    return {
        ...base,
        type: "assignment",
        assignmentId: b.assignmentId ? String(b.assignmentId) : undefined,
        title: String(b.title || "Assignment"),
        description: b.description ? String(b.description) : undefined,
        instructions: b.instructions ? String(b.instructions) : undefined,
        submissionTypes: submissionTypes as ("text" | "photo" | "audio")[],
        isBlocking: b.isBlocking === true,
        maxFileSize: typeof b.maxFileSize === "number" ? b.maxFileSize : 10,
    };
}

function parseDividerBlock(
    b: Record<string, unknown>,
    base: { id: string; animation?: AnimationConfig }
): DividerBlock {
    const validStyles = ["line", "space", "section-break"];
    return {
        ...base,
        type: "divider",
        style: validStyles.includes(b.style as string)
            ? (b.style as DividerBlock["style"])
            : "line",
    };
}

function parseAIInsightBlock(
    b: Record<string, unknown>,
    base: { id: string; animation?: AnimationConfig }
): AIInsightBlock {
    return {
        ...base,
        type: "ai-insight",
        prompt: b.prompt ? String(b.prompt) : undefined,
        showSummary: b.showSummary !== false, // Default to true
        showSimulation: b.showSimulation === true,
        context: b.context ? String(b.context) : undefined,
    };
}

/**
 * Validate a CourseContentJSON structure
 * Returns validation errors if any
 */
export function validateContent(
    content: CourseContentJSON
): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!content.version) {
        errors.push("Missing version field");
    }

    if (!Array.isArray(content.blocks)) {
        errors.push("Blocks must be an array");
        return { valid: false, errors };
    }

    // Check for duplicate IDs
    const ids = new Set<string>();
    content.blocks.forEach((block, index) => {
        if (!block.id) {
            errors.push(`Block at index ${index} missing id`);
        } else if (ids.has(block.id)) {
            errors.push(`Duplicate block id: ${block.id}`);
        } else {
            ids.add(block.id);
        }
    });

    return { valid: errors.length === 0, errors };
}

/**
 * Extract all text content from blocks for AI processing
 */
export function extractTextContent(blocks: ContentBlock[]): string {
    return blocks
        .filter((b): b is TextBlock => b.type === "text")
        .map((b) => b.content)
        .join("\n\n");
}

/**
 * Get blocks up to a specific section for progressive rendering
 */
export function getBlocksUpToIndex(
    blocks: ContentBlock[],
    unlockedIndex: number
): ContentBlock[] {
    return blocks.slice(0, unlockedIndex + 1);
}
