"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

type QuizBlockProps = {
  question: string;
  options: string[];
  correctIndex: number;
  onComplete: () => void;
};

export default function QuizBlock({
  question,
  options,
  correctIndex,
  onComplete,
}: QuizBlockProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (index: number) => {
    if (isSubmitted && selected === correctIndex) return; // Already correct
    setSelected(index);
    setIsSubmitted(true);

    if (index === correctIndex) {
      // Success!
      setTimeout(() => {
        onComplete();
      }, 800);
    }
  };

  const isCorrect = isSubmitted && selected === correctIndex;

  return (
    <div className="bg-navy p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-power-teal/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="flex items-center gap-3 mb-6">
        <HelpCircle className="text-power-teal" />
        <h3 className="font-black text-lg uppercase tracking-widest text-white/50">
          Checkpoint
        </h3>
      </div>

      <h4 className="text-2xl font-bold mb-8">{question}</h4>

      <div className="space-y-3">
        {options.map((opt, i) => {
          let stateStyles = "bg-white/10 hover:bg-white/20 border-white/5";

          if (isSubmitted && i === selected) {
            stateStyles =
              i === correctIndex
                ? "bg-green-500/20 border-green-500 text-green-200"
                : "bg-red-500/20 border-red-500 text-red-200";
          } else if (isSubmitted && i === correctIndex) {
            stateStyles =
              "bg-green-500/10 border-green-500/50 text-green-100 opacity-70";
          }

          return (
            <button
              key={i}
              onClick={() => handleSubmit(i)}
              disabled={isCorrect}
              className={`w-full p-4 rounded-xl text-left font-bold transition-all border-2 flex justify-between items-center ${stateStyles}`}
            >
              <span>{opt}</span>
              {isSubmitted &&
                i === selected &&
                (i === correctIndex ? (
                  <CheckCircle2 size={20} />
                ) : (
                  <XCircle size={20} />
                ))}
            </button>
          );
        })}
      </div>

      {isCorrect && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="mt-4 text-center text-power-teal font-black uppercase tracking-widest text-sm"
        >
          Access Granted &darr;
        </motion.div>
      )}
    </div>
  );
}
