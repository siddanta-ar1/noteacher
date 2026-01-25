
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function POST(req: Request) {
    try {
        const { nodeId, sectionIndex, content, customPrompt, context } =
            await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: "GEMINI_API_KEY is missing" },
                { status: 500 }
            );
        }

        const supabase = await createServerSupabaseClient();

        // Check cache first
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

        // Generate new summary
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const model = genAI.getGenerativeModel({
            model: "gemini-pro", // Fallback to standard model
            systemInstruction: `
You are an expert educational content summarizer for NOTEacher.
Generate concise, engaging summaries that:
1. Capture the key learning points
2. Use simple, clear language
3. Are 2-3 sentences maximum
4. Highlight practical applications when relevant
5. Never use bullet points - write in flowing prose
6. Feel encouraging and motivational

${customPrompt ? `Additional instructions: ${customPrompt}` : ""}
      `,
        });

        const prompt = context
            ? `Summarize this learning content:\n\n${context}`
            : content
                ? `Summarize this learning content:\n\n${content}`
                : "Generate a brief, encouraging summary for this section of the lesson.";

        const result = await model.generateContent(prompt);
        const summary = result.response.text();

        // Cache the result if we have node info
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
    } catch (error: any) {
        console.error("AI Summary Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to generate summary" },
            { status: 500 }
        );
    }
}
