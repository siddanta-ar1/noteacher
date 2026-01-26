
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import Groq from "groq-sdk";

export async function POST(req: Request) {
    let nodeId, sectionIndex, content, customPrompt, context;

    // 0. Parse Body ONCE safely
    try {
        const body = await req.json();
        nodeId = body.nodeId;
        sectionIndex = body.sectionIndex;
        content = body.content;
        customPrompt = body.customPrompt;
        context = body.context;
    } catch (e) {
        return NextResponse.json({ error: "Invalid Request Body" }, { status: 400 });
    }

    try {
        // 1. Try Gemini first
        if (process.env.GEMINI_API_KEY) {
            try {
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

                // Generate new summary with Gemini
                const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
                const model = genAI.getGenerativeModel({
                    model: "gemini-1.5-flash",
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

                // Cache the result
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

            } catch (geminiError: any) {
                console.error("Gemini failed, trying fallback...", geminiError.message);
                // 1.1 Trigger fallback logic below by throwing
                throw geminiError;
            }
        } else {
            throw new Error("GEMINI_API_KEY is missing");
        }

    } catch (error: any) {
        console.error("Primary AI Error:", error.message);

        // 2. Fallback to Groq (DeepSeek)
        if (process.env.GROQ_API_KEY) {
            try {
                console.log("Attempting fallback to Groq (DeepSeek)...");
                const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

                // Reuse parsed variables
                const systemPrompt = `You are an expert educational summarizer. Generate concise (2-3 sentences), engaging, narrative summaries. No bullet points. ${customPrompt || ""}`;
                const userPrompt = context ? `Summarize: ${context}` : (content || "Generate a summary.");

                const chatCompletion = await groq.chat.completions.create({
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: userPrompt }
                    ],
                    model: "deepseek-r1-distill-llama-70b",
                });

                const summary = chatCompletion.choices[0]?.message?.content || "";
                return NextResponse.json({ summary, source: "deepseek-groq" });

            } catch (groqError: any) {
                console.error("Groq/DeepSeek Error:", groqError.message);
                // Continue to mock
            }
        }

        // 3. Mock Fallback
        const mockSummary = "This section covers key engineering concepts. (AI unavailable - displaying placeholder)";

        return NextResponse.json({
            summary: mockSummary,
            cached: false,
            isFallback: true,
            errorDetails: error.message
        });
    }
}
