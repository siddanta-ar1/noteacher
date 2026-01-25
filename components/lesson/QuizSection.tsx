"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";

type QuizProps = {
  data: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation?: string;
  };
  onPass: () => void;
};

export default function QuizSection({ data, onPass }: QuizProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");

  const handleCheck = (index: number) => {
    if (status === "correct") return; // Prevent changing if already passed

    setSelected(index);

    if (index === data.correctIndex) {
      setStatus("correct");
      onPass(); // UNLOCK THE LESSON
    } else {
      setStatus("wrong");
    }
  };

  return (
    <div className="my-12 p-1 bg-gradient-to-br from-navy via-power-purple to-power-teal rounded-3xl">
      <div className="bg-white rounded-[1.4rem] p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-slate-100 rounded-full text-navy">
            <HelpCircle size={20} />
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-slate-400">
            Knowledge Checkpoint
          </span>
        </div>

        {/* Question */}
        <h3 className="text-xl font-black text-slate-900 mb-8 leading-tight">
          {data.question}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {data.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleCheck(idx)}
              className={`w-full p-4 rounded-xl text-left font-bold transition-all border-2 flex justify-between items-center group
                ${
                  status === "correct" && idx === data.correctIndex
                    ? "bg-green-50 border-green-500 text-green-700"
                    : status === "wrong" && idx === selected
                      ? "bg-red-50 border-red-500 text-red-700"
                      : selected === idx
                        ? "border-navy text-navy"
                        : "border-slate-100 text-slate-600 hover:bg-slate-50 hover:border-slate-200"
                }
              `}
            >
              <span>{option}</span>

              {status === "correct" && idx === data.correctIndex && (
                <CheckCircle2
                  size={20}
                  className="text-green-600 animate-bounce"
                />
              )}
              {status === "wrong" && idx === selected && (
                <XCircle size={20} className="text-red-500" />
              )}
            </button>
          ))}
        </div>

        {/* Feedback / Explanation */}
        <AnimatePresence>
          {status !== "idle" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="overflow-hidden"
            >
              <div
                className={`mt-6 p-4 rounded-xl text-sm font-medium ${
                  status === "correct"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-50 text-red-800"
                }`}
              >
                <p className="font-bold mb-1">
                  {status === "correct" ? "Excellent!" : "Not quite."}
                </p>
                {data.explanation}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
