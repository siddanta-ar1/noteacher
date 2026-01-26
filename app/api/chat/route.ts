
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import Groq from "groq-sdk";

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
  let message, history, context;

  // 0. Parse Body ONCE safely
  try {
    const body = await req.json();
    message = body.message;
    history = body.history || [];
    context = body.context;
  } catch (e) {
    return NextResponse.json({ error: "Invalid Request Body" }, { status: 400 });
  }

  try {
    // 1. Check API Key presence
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Missing GEMINI_API_KEY");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // 2. Try Primary Model (1.5-flash)
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
    console.error("Gemini API Error:", error.message);

    // 3. Fallback to Groq (DeepSeek)
    if (process.env.GROQ_API_KEY) {
      try {
        console.log("Attempting fallback to Groq (DeepSeek)...");
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        // Reuse variables from top
        const systemPrompt = `You are "NOTEacher AI". Explain engineering concepts simply using analogies. ${context ? `CONTEXT: ${context}` : ""} Keep answers under 3 sentences. Use emojis.`;

        const messages = [
          { role: "system", content: systemPrompt },
          ...history.map((msg: any) => ({ role: msg.role === "ai" ? "assistant" : "user", content: msg.text })),
          { role: "user", content: message }
        ];

        const chatCompletion = await groq.chat.completions.create({
          messages: messages as any,
          model: "deepseek-r1-distill-llama-70b",
        });

        const reply = chatCompletion.choices[0]?.message?.content || "";
        return NextResponse.json({ reply, source: "deepseek-groq" });

      } catch (groqError: any) {
        console.error("Groq/DeepSeek Error:", groqError.message);
        // Continue to mock fallback
      }
    }

    // 4. Fallback to Mock Engine
    try {
      // Reuse variables from top
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
