"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

// Questions Configuration
const QUESTIONS = [
  {
    id: 1,
    key: "mission", // key for database storage
    title: "🎯 What's your primary mission?",
    subtitle: "We'll tailor your learning path",
    options: [
      {
        id: "exam",
        label: "Ace my Exams",
        color: "text-purple-500",
        shadow: "shadow-[0_6px_0_#7C3AED]",
        bg: "bg-purple-50",
        border: "border-purple-400",
      },
      {
        id: "career",
        label: "Career Pivot to Hardware",
        color: "text-teal-500",
        shadow: "shadow-[0_6px_0_#0D9488]",
        bg: "bg-teal-50",
        border: "border-teal-400",
      },
      {
        id: "build",
        label: "Build a CPU",
        color: "text-orange-500",
        shadow: "shadow-[0_6px_0_#EA580C]",
        bg: "bg-orange-50",
        border: "border-orange-400",
      },
    ],
  },
  {
    id: 2,
    key: "level",
    title: "🧠 How strong is your foundation?",
    subtitle: "Be honest — we adjust difficulty",
    options: [
      {
        id: "beginner",
        label: "Beginner (Logic Gates)",
        color: "text-purple-500",
        shadow: "shadow-[0_6px_0_#7C3AED]",
        bg: "bg-purple-50",
        border: "border-purple-400",
      },
      {
        id: "intermediate",
        label: "Intermediate (Architecture)",
        color: "text-teal-500",
        shadow: "shadow-[0_6px_0_#0D9488]",
        bg: "bg-teal-50",
        border: "border-teal-400",
      },
      {
        id: "advanced",
        label: "Advanced (Pipelining/RISC-V)",
        color: "text-orange-500",
        shadow: "shadow-[0_6px_0_#EA580C]",
        bg: "bg-orange-50",
        border: "border-orange-400",
      },
    ],
  },
  {
    id: 3,
    key: "commitment",
    title: "⏱ How much time can you commit?",
    subtitle: "Consistency beats intensity",
    options: [
      {
        id: "light",
        label: "15–30 min / day",
        color: "text-purple-500",
        shadow: "shadow-[0_6px_0_#7C3AED]",
        bg: "bg-purple-50",
        border: "border-purple-400",
      },
      {
        id: "medium",
        label: "1 hour / day",
        color: "text-teal-500",
        shadow: "shadow-[0_6px_0_#0D9488]",
        bg: "bg-teal-50",
        border: "border-teal-400",
      },
      {
        id: "hardcore",
        label: "2+ hours / day",
        color: "text-orange-500",
        shadow: "shadow-[0_6px_0_#EA580C]",
        bg: "bg-orange-50",
        border: "border-orange-400",
      },
    ],
  },
];

export default function InterestPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const current = QUESTIONS[step];
  const progress = ((step + 1) / QUESTIONS.length) * 100;

  // Handle saving data to Supabase
  const handleFinish = async () => {
    setIsLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No user found");

      // Transform answers into a cleaner JSON object
      // e.g. { mission: "exam", level: "beginner", commitment: "light" }
      const profileData = QUESTIONS.reduce(
        (acc, q) => {
          acc[q.key] = answers[q.id];
          return acc;
        },
        {} as Record<string, string>,
      );

      const { error } = await supabase
        .from("profiles")
        .update({
          interests: profileData, // Storing the wizard JSON
        })
        .eq("id", user.id);

      if (error) throw error;

      router.push("/home");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FF] flex flex-col">
      {/* Progress Bar */}
      <div className="h-4 bg-slate-200">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-[#0055FF]"
        />
      </div>

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 flex flex-col justify-center">
        {/* Question Card */}
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white rounded-[32px] shadow-2xl p-8 border border-slate-100"
        >
          <h2 className="text-4xl font-black text-[#0055FF] mb-2 leading-tight">
            {current.title}
          </h2>
          <p className="text-slate-500 mb-8 font-medium text-lg">
            {current.subtitle}
          </p>

          <div className="space-y-4">
            {current.options.map((opt) => {
              const selected = answers[current.id] === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() =>
                    setAnswers({ ...answers, [current.id]: opt.id })
                  }
                  className={`w-full p-6 rounded-2xl border-2 text-left font-bold transition-all group relative overflow-hidden
                    ${
                      selected
                        ? `${opt.bg} ${opt.border} ${opt.shadow} translate-y-[2px]`
                        : "bg-white border-slate-200 hover:border-slate-300 hover:-translate-y-1 hover:shadow-lg"
                    }`}
                >
                  <span
                    className={`text-xl relative z-10 ${
                      selected ? opt.color : "text-slate-700"
                    }`}
                  >
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="mt-10 flex gap-4">
            {step > 0 && (
              <button
                disabled={isLoading}
                onClick={() => setStep(step - 1)}
                className="w-1/3 py-4 rounded-2xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors"
              >
                Back
              </button>
            )}

            {step < QUESTIONS.length - 1 ? (
              <button
                disabled={!answers[current.id]}
                onClick={() => setStep(step + 1)}
                className={`flex-1 py-4 rounded-2xl font-black text-white transition-all
                  ${
                    answers[current.id]
                      ? "bg-[#0055FF] shadow-[0_6px_0_#003ECC] hover:translate-y-[2px] hover:shadow-[0_4px_0_#003ECC]"
                      : "bg-slate-300 cursor-not-allowed opacity-50"
                  }`}
              >
                Next Step
              </button>
            ) : (
              <button
                disabled={!answers[current.id] || isLoading}
                onClick={handleFinish}
                className={`flex-1 py-4 rounded-2xl font-black text-white bg-[#0055FF]
                  shadow-[0_6px_0_#003ECC] flex items-center justify-center gap-2
                  ${isLoading ? "opacity-80 cursor-wait" : "hover:translate-y-[2px] hover:shadow-[0_4px_0_#003ECC]"}
                `}
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  "Start My Journey 🚀"
                )}
              </button>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
