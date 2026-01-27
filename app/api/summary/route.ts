import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { generateAIResponse } from "@/lib/ai-client";

export async function POST(req: Request) {
    let nodeId: string | undefined;
    let sectionIndex: number | undefined;
    let content: string | undefined;
    let customPrompt: string | undefined;
    let context: string | undefined;

    // 0. Parse Body safely
    try {
        const body = await req.json();
        nodeId = body.nodeId;
        sectionIndex = body.sectionIndex;
        content = body.content;
        customPrompt = body.customPrompt;
        context = body.context;
    } catch {
        return NextResponse.json({ error: "Invalid Request Body" }, { status: 400 });
    }

    // 1. Check API Key
    if (!process.env.OPENROUTER_API_KEY) {
        console.warn("[Summary API] OPENROUTER_API_KEY missing");
        return NextResponse.json({
            summary: "This section covers key engineering concepts. (AI unavailable - displaying placeholder)",
            cached: false,
            isFallback: true,
            errorDetails: "API key not configured",
        });
    }

    try {
        const supabase = await createServerSupabaseClient();

        // 2. Check cache first
        if (nodeId && sectionIndex !== undefined) {
            const { data: cached } = await supabase
                .from("ai_summaries")
                .select("summary_text")
                .eq("node_id", nodeId)
                .eq("section_index", sectionIndex)
                .single();

            if (cached?.summary_text) {
                return NextResponse.json({ summary: cached.summary_text, cached: true });
            }
        }

        // 3. Build system prompt
        const systemPrompt = `You are an expert educational content summarizer for NOTEacher.
Generate concise, engaging summaries that:
1. Capture the key learning points
2. Use simple, clear language
3. Are 2-3 sentences maximum
4. Highlight practical applications when relevant
5. Never use bullet points - write in flowing prose
6. Feel encouraging and motivational

${customPrompt ? `Additional instructions: ${customPrompt}` : ""}`;

        // 4. Build user prompt
        const userPrompt = context
            ? `Summarize this learning content:\n\n${context}`
            : content
                ? `Summarize this learning content:\n\n${content}`
                : "Generate a brief, encouraging summary for this section of the lesson.";

        // 5. Generate summary using OpenRouter
        const summary = await generateAIResponse({
            systemPrompt,
            userMessage: userPrompt,
            maxTokens: 512,
        });

        // 6. Cache the result
        if (nodeId && sectionIndex !== undefined) {
            await supabase.from("ai_summaries").upsert(
                {
                    node_id: nodeId,
                    section_index: sectionIndex,
                    summary_text: summary,
                    generated_at: new Date().toISOString(),
                },
                { onConflict: "node_id,section_index" }
            );
        }

        return NextResponse.json({ summary, cached: false });

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("[Summary API] AI Error:", errorMessage);

        // 7. Mock Fallback
        const mockSummary = "This section covers key engineering concepts. (AI unavailable - displaying placeholder)";

        return NextResponse.json({
            summary: mockSummary,
            cached: false,
            isFallback: true,
            errorDetails: errorMessage,
        });
    }
}
