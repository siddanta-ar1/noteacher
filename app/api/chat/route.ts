
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// --- Mock Engine ---
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
  let endpointStatus = "real";

  try {
    const { message, history = [], context } = await req.json();

    // 1. Check API Key presence
    if (!process.env.GEMINI_API_KEY) {
      console.warn("Missing GEMINI_API_KEY, using mock.");
      return NextResponse.json({ reply: getMockReply(message) });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // 2. Try Primary Model (1.5-flash is best for speed/cost)
    // If this fails, the catch block will trigger the mock fallback
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `
You are an elite engineering tutor named "NOTEacher AI".
Explain complex engineering concepts simply using analogies.
CONTEXT: ${context || "General Engineering Fundamentals"}
RULES: Keep answers under 3 sentences. Use emojis. Guide users.
            `,
    });

    const formattedHistory = history.map((msg: any) => ({
      role: msg.role === "ai" ? "model" : "user",
      parts: [{ text: msg.text || "" }],
    }));

    const chat = model.startChat({ history: formattedHistory });
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const reply = response.text();

    return NextResponse.json({ reply });

  } catch (error: any) {
    console.error("Gemini API Error (Falling back to Mock):", error.message);

    // 3. Fallback to Mock Engine
    // We catch 404s, 500s, or any other API error here
    try {
      const { message } = await req.clone().json().catch(() => ({ message: "" })); // recover body if possible
      const mockReply = getMockReply(message || "Hello");

      return NextResponse.json({
        reply: mockReply,
        isFallback: true,
        errorDetails: error.message
      });
    } catch (fallbackError) {
      return NextResponse.json(
        { error: "Service unavailable." },
        { status: 500 }
      );
    }
  }
}
