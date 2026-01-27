/**
 * AI Client for NOTEacher
 * 
 * Uses OpenRouter API with smart model selection:
 * - Primary: google/gemini-2.0-flash-exp:free (multimodal, best free model)
 * - Fallback: meta-llama/llama-3.3-70b-instruct:free (reliable text-only)
 * 
 * Features:
 * - Text generation (AI Teacher, Summaries)
 * - Vision analysis (Handwriting detection)
 * - Automatic fallback on errors (503, rate limits)
 */

import OpenAI from "openai";

// Model Configuration
const MODELS = {
    // Best free multimodal model (text + images)
    PRIMARY: "google/gemini-2.0-flash-exp:free",
    // Reliable fallback for text-only tasks
    FALLBACK: "meta-llama/llama-3.3-70b-instruct:free",
} as const;

// Initialize OpenAI client pointing to OpenRouter
const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "NOTEacher",
    },
});

// Types
export interface Message {
    role: "user" | "assistant" | "system";
    content: string;
}

export interface GenerateOptions {
    systemPrompt: string;
    messages?: Message[];
    userMessage?: string;
    maxTokens?: number;
}

export interface ImageAnalysisOptions {
    imageUrl?: string;
    imageBase64?: string;
    prompt: string;
    maxTokens?: number;
}

/**
 * Check if an error is retryable (503, rate limit, etc.)
 */
function isRetryableError(error: unknown): boolean {
    if (error instanceof Error) {
        const message = error.message.toLowerCase();
        return (
            message.includes("503") ||
            message.includes("rate limit") ||
            message.includes("overloaded") ||
            message.includes("temporarily unavailable") ||
            message.includes("capacity")
        );
    }
    return false;
}

/**
 * Generate AI response for text-based tasks
 * Used by: AI Teacher chat, Summary generation
 * 
 * @param options - Generation options
 * @returns Generated text response
 */
export async function generateAIResponse(options: GenerateOptions): Promise<string> {
    const { systemPrompt, messages = [], userMessage, maxTokens = 1024 } = options;

    // Build message array
    const chatMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        { role: "system", content: systemPrompt },
    ];

    // Add conversation history
    for (const msg of messages) {
        chatMessages.push({
            role: msg.role === "assistant" ? "assistant" : "user",
            content: msg.content,
        });
    }

    // Add user message if provided separately
    if (userMessage) {
        chatMessages.push({ role: "user", content: userMessage });
    }

    // Try primary model first
    try {
        const response = await openai.chat.completions.create({
            model: MODELS.PRIMARY,
            messages: chatMessages,
            max_tokens: maxTokens,
            temperature: 0.7,
        });

        return response.choices[0]?.message?.content || "";
    } catch (primaryError) {
        console.error("[AI Client] Primary model failed:", primaryError);

        // Retry with fallback model if error is retryable
        if (isRetryableError(primaryError)) {
            console.log("[AI Client] Retrying with fallback model...");

            try {
                const response = await openai.chat.completions.create({
                    model: MODELS.FALLBACK,
                    messages: chatMessages,
                    max_tokens: maxTokens,
                    temperature: 0.7,
                });

                return response.choices[0]?.message?.content || "";
            } catch (fallbackError) {
                console.error("[AI Client] Fallback model also failed:", fallbackError);
                throw fallbackError;
            }
        }

        throw primaryError;
    }
}

/**
 * Analyze an image using vision capabilities
 * Used by: Assignment handwriting transcription
 * 
 * @param options - Image analysis options
 * @returns Analysis/transcription result
 */
export async function analyzeImage(options: ImageAnalysisOptions): Promise<string> {
    const { imageUrl, imageBase64, prompt, maxTokens = 2048 } = options;

    if (!imageUrl && !imageBase64) {
        throw new Error("Either imageUrl or imageBase64 must be provided");
    }

    // Build image content
    const imageContent: OpenAI.Chat.ChatCompletionContentPart = imageUrl
        ? { type: "image_url", image_url: { url: imageUrl } }
        : { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } };

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        {
            role: "user",
            content: [
                { type: "text", text: prompt },
                imageContent,
            ],
        },
    ];

    // Try primary model (Gemini Flash is multimodal)
    try {
        const response = await openai.chat.completions.create({
            model: MODELS.PRIMARY,
            messages,
            max_tokens: maxTokens,
            temperature: 0.3, // Lower temperature for more accurate transcription
        });

        return response.choices[0]?.message?.content || "";
    } catch (primaryError) {
        console.error("[AI Client] Vision request failed:", primaryError);

        // Note: Fallback model (Llama) doesn't support vision
        // So we can only retry with primary or throw
        if (isRetryableError(primaryError)) {
            console.log("[AI Client] Retrying vision request...");

            // Wait a bit before retry
            await new Promise((resolve) => setTimeout(resolve, 1000));

            try {
                const response = await openai.chat.completions.create({
                    model: MODELS.PRIMARY,
                    messages,
                    max_tokens: maxTokens,
                    temperature: 0.3,
                });

                return response.choices[0]?.message?.content || "";
            } catch (retryError) {
                console.error("[AI Client] Vision retry failed:", retryError);
                throw retryError;
            }
        }

        throw primaryError;
    }
}

/**
 * TODO: Audio Transcription (Whisper)
 * 
 * OpenRouter does not currently support audio/Whisper models.
 * For audio submission features, use Groq's Whisper API:
 * 
 * Example with Groq:
 * ```typescript
 * import Groq from "groq-sdk";
 * 
 * const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
 * 
 * const transcription = await groq.audio.transcriptions.create({
 *     file: audioFile,
 *     model: "whisper-large-v3",
 * });
 * ```
 * 
 * This will be implemented when audio submission feature is enabled.
 */
export async function transcribeAudio(_audioFile: File): Promise<string> {
    // Placeholder - OpenRouter doesn't support audio yet
    // Use Groq's Whisper API for audio transcription
    throw new Error(
        "Audio transcription not yet implemented. " +
        "OpenRouter does not support Whisper. " +
        "Use Groq's Whisper API for this feature."
    );
}

// Export models for reference
export { MODELS };
