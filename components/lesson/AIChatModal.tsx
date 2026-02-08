"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Send, Sparkles, Bot, User, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useUser } from "@/hooks/useUser";

type Message = {
  id: string;
  role: "user" | "ai";
  text: string;
};

export default function AIChatModal({
  isOpen,
  onClose,
  context,
}: {
  isOpen: boolean;
  onClose: () => void;
  context?: string;
}) {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      text: "Greetings! I'm your AI Learning Assistant. Ask me anything about this lesson.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userText = input;
    setInput("");

    // 1. Add User Message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: userText,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      // 2. Call the Backend API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          history: messages.slice(1),
          context: context,
        }),
      });

      const data = await response.json();

      if (data.error) throw new Error(data.error);

      // 3. Add AI Response
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: data.reply,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "ai",
          text: `⚠️ Error: ${error.message || "Connection lost."}`,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-[60]"
          />

          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed inset-x-4 bottom-4 md:bottom-10 md:inset-x-auto md:right-10 md:w-[28rem] h-[32rem] bg-white rounded-[2.5rem] shadow-2xl z-[70] flex flex-col overflow-hidden border-4 border-white"
          >
            {/* Optimized Header */}
            <div className="bg-navy p-6 flex justify-between items-center bg-gradient-to-r from-navy to-indigo-950">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-full flex items-center justify-center border border-white/20 shadow-lg">
                  <Sparkles className="text-power-teal w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-xl tracking-tight">
                    Learning Assistant
                  </h3>
                  <p className="text-power-teal text-xs font-bold uppercase tracking-widest flex items-center gap-1 opacity-90">
                    <Bot size={12} /> Powered by Gemini
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all hover:rotate-90"
              >
                <X size={20} />
              </button>
            </div>

            {/* Optimized Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 scroll-smooth">
              {messages.map((msg) => {
                const isUser = msg.role === "user";
                const avatarLabel = isUser
                  ? (user?.user_metadata?.full_name?.[0] || user?.email?.[0] || "U").toUpperCase()
                  : "AI";

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex gap-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm border-2 overflow-hidden ${isUser
                            ? "bg-indigo-100 border-indigo-200 text-indigo-700"
                            : "bg-white border-power-teal/30 text-power-teal"
                          }`}
                      >
                        {isUser && user?.user_metadata?.avatar_url ? (
                          <img
                            src={user.user_metadata.avatar_url}
                            alt="User"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="font-black text-xs">{avatarLabel}</span>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {isUser ? "You" : "Gemini"}
                      </span>
                    </div>

                    <div
                      className={`p-4 rounded-2xl max-w-[75%] text-sm leading-relaxed shadow-sm ${isUser
                          ? "bg-navy text-white rounded-tr-none shadow-indigo-900/10"
                          : "bg-white text-slate-700 rounded-tl-none border border-slate-200/60 shadow-slate-200/50"
                        }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                );
              })}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2 ml-14 items-center text-slate-400 text-xs font-bold"
                >
                  <Loader2 className="animate-spin w-4 h-4" />
                  Thinking...
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2 bg-slate-50 p-2 rounded-full border border-slate-200 focus-within:border-navy focus-within:ring-2 focus-within:ring-navy/10 transition-all shadow-sm"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  placeholder="Ask about this concept..."
                  className="flex-1 bg-transparent border-none outline-none px-4 text-slate-700 placeholder:text-slate-400 font-medium focus:ring-0"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="w-10 h-10 bg-navy text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all bg-gradient-to-r from-navy to-indigo-900"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
