"use client";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  Sparkles,
  Zap,
  MessageCircle,
  Bot,
  User,
  RotateCcw,
  BookOpen,
} from "lucide-react";
import { useState } from "react";

export default function AIChatModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm your NOTEacher AI. I've read this lesson on NAND Gates. Need a quick summary or have a specific question?",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", content: input }]);
    setInput("");

    // Simulate AI Response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Great question! Tying NAND inputs together creates a NOT gate because it forces the output to be the inverse of the single input signal.",
        },
      ]);
    }, 1000);
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
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60]"
          />

          {/* Chat Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-6 w-[400px] h-[600px] bg-white rounded-[2.5rem] shadow-2xl border-2 border-slate-100 flex flex-col overflow-hidden z-[70]"
          >
            {/* Header */}
            <div className="bg-navy p-6 text-white">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-power-purple rounded-2xl flex items-center justify-center shadow-lg">
                    <Bot size={24} />
                  </div>
                  <div>
                    <h3 className="font-black leading-tight">AI Teacher</h3>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-power-teal rounded-full animate-pulse" />
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                        Context: NAND Gates
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <button className="flex-1 bg-white/10 hover:bg-white/20 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-2 border border-white/10 transition-all">
                  <Sparkles size={12} /> Summarize
                </button>
                <button className="flex-1 bg-white/10 hover:bg-white/20 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-2 border border-white/10 transition-all">
                  <RotateCcw size={12} /> Key Terms
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      m.role === "assistant"
                        ? "bg-slate-100 text-slate-400"
                        : "bg-navy text-white"
                    }`}
                  >
                    {m.role === "assistant" ? (
                      <Bot size={18} />
                    ) : (
                      <User size={18} />
                    )}
                  </div>
                  <div
                    className={`p-4 rounded-2xl text-sm font-medium leading-relaxed max-w-[80%] ${
                      m.role === "assistant"
                        ? "bg-slate-50 text-slate-700"
                        : "bg-power-purple text-white"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50">
              <div className="relative">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask your AI teacher..."
                  className="w-full bg-white border-2 border-slate-200 rounded-2xl py-4 pl-6 pr-14 focus:outline-none focus:border-navy transition-all shadow-sm font-medium"
                />
                <button
                  onClick={handleSend}
                  className="absolute right-2 top-2 w-10 h-10 bg-navy text-white rounded-xl flex items-center justify-center hover:bg-navy-dark active:scale-95 transition-all"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
