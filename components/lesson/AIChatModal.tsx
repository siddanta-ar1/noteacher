"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Send, Sparkles, Bot, User } from "lucide-react";
import { useState, useEffect, useRef } from "react";

type Message = {
  id: string;
  role: "user" | "ai";
  text: string;
};

export default function AIChatModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      text: "Greetings, Cadet! I am ready to deconstruct any complex topic for you. What's confusing you?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: input,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking delay
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: "That's an excellent question. In the context of logic gates, think of the connection as a flow of water. If you block the flow (0), nothing passes.",
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-[60]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed inset-x-4 bottom-4 md:bottom-10 md:inset-x-auto md:right-10 md:w-[28rem] h-[32rem] bg-white rounded-[2.5rem] shadow-2xl z-[70] flex flex-col overflow-hidden border-4 border-white"
          >
            {/* Header */}
            <div className="bg-navy p-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-power-teal rounded-full flex items-center justify-center shadow-lg shadow-power-teal/20">
                  <Sparkles className="text-white w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-white italic text-lg">
                    AI Tutor
                  </h3>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest">
                    Online
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white/50 hover:text-white transition-colors"
              >
                <X />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div
                    className={`
                    w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm
                    ${msg.role === "ai" ? "bg-white text-navy" : "bg-navy text-white"}
                  `}
                  >
                    {msg.role === "ai" ? <Bot size={16} /> : <User size={16} />}
                  </div>
                  <div
                    className={`
                    p-4 rounded-2xl max-w-[80%] text-sm font-medium shadow-sm
                    ${
                      msg.role === "ai"
                        ? "bg-white text-slate-700 rounded-tl-none border border-slate-100"
                        : "bg-navy text-white rounded-tr-none shadow-navy/20"
                    }
                  `}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2 ml-12"
                >
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
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
                className="flex items-center gap-2 bg-slate-50 p-2 rounded-full border border-slate-200 focus-within:border-navy focus-within:ring-2 focus-within:ring-navy/10 transition-all"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about this concept..."
                  className="flex-1 bg-transparent border-none outline-none px-4 text-slate-700 placeholder:text-slate-400 font-medium"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="w-10 h-10 bg-navy text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
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
