import { NextResponse } from "next/server";
import { analyzeImage } from "@/lib/ai-client";

/**
 * Image Analysis API Endpoint
 * 
 * Used for handwriting transcription in assignment submissions.
 * Accepts either an image URL or base64-encoded image data.
 * 
 * POST /api/analyze-image
 * Body: { imageUrl?: string, imageBase64?: string, prompt?: string }
 * Response: { transcription: string } | { error: string }
 */
export async function POST(req: Request) {
    let imageUrl: string | undefined;
    let imageBase64: string | undefined;
    let prompt: string | undefined;

    // 0. Parse Body safely
    try {
        const body = await req.json();
        imageUrl = body.imageUrl;
        imageBase64 = body.imageBase64;
        prompt = body.prompt;
    } catch {
        return NextResponse.json({ error: "Invalid Request Body" }, { status: 400 });
    }

    // 1. Validate input
    if (!imageUrl && !imageBase64) {
        return NextResponse.json(
            { error: "Either imageUrl or imageBase64 must be provided" },
            { status: 400 }
        );
    }

    // 2. Check API Key
    if (!process.env.OPENROUTER_API_KEY) {
        console.error("[Analyze Image API] OPENROUTER_API_KEY missing");
        return NextResponse.json(
            { error: "Image analysis service not configured" },
            { status: 503 }
        );
    }

    try {
        // 3. Build analysis prompt
        const analysisPrompt = prompt || `You are an expert at reading handwritten text.
Carefully transcribe ALL the handwritten text visible in this image.

Instructions:
- Transcribe exactly what is written, preserving the original formatting where possible
- If there are mathematical equations, use standard notation (e.g., x^2 for x squared)
- If any text is unclear, indicate it with [unclear] but still try to transcribe it
- Include all visible text, including any labels, titles, or annotations
- Maintain paragraph breaks if visible in the handwriting

Respond with ONLY the transcribed text, no additional commentary.`;

        // 4. Analyze the image
        const transcription = await analyzeImage({
            imageUrl,
            imageBase64,
            prompt: analysisPrompt,
            maxTokens: 4096, // Allow longer transcriptions
        });

        return NextResponse.json({
            transcription,
            success: true,
        });

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("[Analyze Image API] Error:", errorMessage);

        return NextResponse.json(
            {
                error: "Failed to analyze image",
                details: errorMessage,
            },
            { status: 500 }
        );
    }
}
