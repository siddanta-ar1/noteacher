import { NextResponse } from "next/server";
import { generateAIResponse, type Message } from "@/lib/ai-client";

// --- Mock Engine (Offline Fallback) ---
function getMockReply(message: string): string {
  const lowerMsg = message.toLowerCase();
  if (lowerMsg.includes("hello") || lowerMsg.includes("hi")) {
    return "Hello! I'm NOTEacher AI (Offline Mode). I'm here to help you understand engineering concepts. What are we studying today? 🚀";
  } else if (lowerMsg.includes("html")) {
    return "HTML is like the skeleton of a building. It provides the structure, but it doesn't look pretty until you add CSS (the paint and decoration)! 🏗️";
  } else if (lowerMsg.includes("css")) {
    return "Think of CSS as the interior designer. It takes the raw HTML structure and makes it look beautiful with colors, fonts, and layouts. 🎨";
  } else if (lowerMsg.includes("dns")) {
    return "DNS is the phonebook of the internet. You use names (google.com) because they are easy to remember, but computers need numbers (IP addresses) to connect. DNS maps the name to the number! 📞";
  } else if (lowerMsg.includes("javascript") || lowerMsg.includes("js")) {
    return "JavaScript is the electricity in the walls. It makes things interactive! Without it, you just have a static building (HTML/CSS). With it, you can turn lights on, open doors, and run machines. ⚡";
  } else if (lowerMsg.includes("react")) {
    return "React is a library that helps you build UI components like Lego blocks. You build small pieces (buttons, headers) and snap them together to make a full app! 🧱";
  } else if (lowerMsg.includes("stat")) {
    return "Statistics helps us make sense of chaos. It separates the signal (the truth) from the noise (random chance). It's essential for making data-driven decisions. 📊";
  }
  return "That's a great question! I'm currently in Offline Mode because the AI connection is unstable, but normally I would explain that concept in depth. Try asking about HTML, CSS, DNS, or Statistics! 🤖";
}

export async function POST(req: Request) {
  let message: string;
  let history: { role: "user" | "ai"; text: string }[] = [];
  let context: string | undefined;

  // 0. Parse Body safely
  try {
    const body = await req.json();
    message = body.message;
    history = body.history || [];
    context = body.context;
  } catch {
    return NextResponse.json({ error: "Invalid Request Body" }, { status: 400 });
  }

  // 1. Check API Key
  if (!process.env.OPENROUTER_API_KEY) {
    console.warn("[Chat API] OPENROUTER_API_KEY missing, using mock response");
    return NextResponse.json({
      reply: getMockReply(message),
      isFallback: true,
      errorDetails: "API key not configured",
    });
  }

  try {
    // 2. Build system prompt
    const systemPrompt = `You are an elite engineering tutor named "NOTEacher AI".
Explain complex engineering concepts simply using analogies.
CONTEXT: ${context || "General Engineering Fundamentals"}
RULES:
- Keep answers under 3 sentences when possible
- Use emojis to make learning fun
- Guide users step by step
- Be encouraging and supportive`;

    // 3. Convert history format
    const messages: Message[] = history.map((msg) => ({
      role: msg.role === "ai" ? "assistant" : "user",
      content: msg.text,
    }));

    // Add the current user message
    messages.push({ role: "user", content: message });

    // 4. Generate response using OpenRouter
    const reply = await generateAIResponse({
      systemPrompt,
      messages,
    });

    return NextResponse.json({ reply });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[Chat API] AI Error:", errorMessage);

    // 5. Fallback to Mock Engine
    const mockReply = getMockReply(message);

    return NextResponse.json({
      reply: mockReply,
      isFallback: true,
      errorDetails: errorMessage,
    });
  }
}
