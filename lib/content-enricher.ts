import type { ContentBlock, SimulationBlock, TextBlock } from "@/types/content";

/**
 * Keyword to Simulation ID Mapping
 * Maps lesson title keywords or content triggers to specific simulation IDs
 */
const SIMULATION_MAPPINGS: Record<string, string> = {
    // Logic & Computer Science
    "logic gate": "logic-gates",
    "boolean": "logic-gates",
    "circuit": "logic-gates",
    "and gate": "logic-gates",
    "or gate": "logic-gates",

    // Statistical Thinking (Level 0)
    "gambler": "StreakBreaker",
    "probability": "StreakBreaker",
    "streak": "StreakBreaker",
    "coin flip": "StreakBreaker",

    "sample size": "ReviewRoulette",
    "anecdote": "ReviewRoulette",
    "review": "ReviewRoulette",
    "bias": "ReviewRoulette",

    "scale": "ScopeSlider",
    "population": "ScopeSlider",
    "magnitude": "ScopeSlider",
    "virus": "ScopeSlider",

    "average": "DataFog",
    "mean": "DataFog",
    "data processing": "DataFog",
    "cognitive load": "DataFog",

    // Web Development
    "box model": "box-model",
    "margin": "box-model",
    "padding": "box-model",

    "flexbox": "flexbox",
    "justify-content": "flexbox",
    "align-items": "flexbox",

    "selector": "selectors",
    "css class": "selectors",

    "dom": "dom",
    "document object model": "dom",

    "network": "network",
    "http": "network",
    "request": "network",
};

/**
 * Enrich content by validating and injecting simulations
 */
export function enrichContent(blocks: ContentBlock[], lessonTitle: string, lessonDescription?: string): ContentBlock[] {
    const enrichedBlocks = [...blocks];
    const normalizedText = (lessonTitle + " " + (lessonDescription || "")).toLowerCase();

    // 1. Check if a simulation is already present
    const hasSimulation = blocks.some(b => b.type === "simulation");

    // 2. If no simulation, try to find a match
    if (!hasSimulation) {
        let matchedSimId: string | null = null;

        // Find first matching keyword
        for (const [keyword, simId] of Object.entries(SIMULATION_MAPPINGS)) {
            if (normalizedText.includes(keyword)) {
                matchedSimId = simId;
                break; // Prioritize the first match
            }
        }

        // 3. Inject the simulation if matched
        if (matchedSimId) {
            const simBlock: SimulationBlock = {
                id: `injected-sim-${Date.now()}`,
                type: "simulation",
                simulationId: matchedSimId,
                instructions: "Interactive Simulation: Explore the concept below.",
                animation: { type: "scale", delay: 0.5, duration: 0.8 }
            };

            // Heuristic: Insert after the first intro text block, or at the end
            let insertIndex = -1;

            // Try to find the first substantial text block (introduction)
            for (let i = 0; i < enrichedBlocks.length; i++) {
                if (enrichedBlocks[i].type === "text") {
                    const textContent = (enrichedBlocks[i] as TextBlock).content;
                    if (textContent.length > 50) {
                        insertIndex = i + 1;
                        break;
                    }
                }
            }

            if (insertIndex !== -1) {
                enrichedBlocks.splice(insertIndex, 0, simBlock);
            } else {
                enrichedBlocks.push(simBlock);
            }
        }
    }

    return enrichedBlocks;
}
