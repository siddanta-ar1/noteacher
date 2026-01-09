"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const GOALS = [
  {
    id: "exam",
    label: "Ace my Exams",
    color: "text-power-purple",
    bg: "bg-power-purple/10",
    border: "border-power-purple",
  },
  {
    id: "career",
    label: "Career Pivot to HW",
    color: "text-power-teal",
    bg: "bg-power-teal/10",
    border: "border-power-teal",
  },
  {
    id: "build",
    label: "Build a CPU",
    color: "text-power-orange",
    bg: "bg-power-orange/10",
    border: "border-power-orange",
  },
];

export default function InterestPage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navy Header Progress */}
      <div className="h-2 w-full bg-slate-100">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "40%" }}
          className="h-full bg-navy"
        />
      </div>

      <main className="flex-1 max-w-2xl mx-auto w-full px-6 flex flex-col justify-center">
        <h2 className="text-4xl font-black text-slate-900 mb-4">
          What's your primary mission?
        </h2>
        <p className="text-slate-400 text-lg mb-10">
          We'll customize your roadmap based on your goals.
        </p>

        <div className="space-y-4">
          {GOALS.map((goal) => (
            <button
              key={goal.id}
              onClick={() => setSelected(goal.id)}
              className={`w-full p-6 rounded-3xl border-2 text-left transition-all group ${
                selected === goal.id
                  ? `${goal.bg} ${goal.border}`
                  : "bg-white border-slate-100 hover:border-slate-200"
              }`}
            >
              <div className="flex justify-between items-center">
                <span
                  className={`text-xl font-bold ${selected === goal.id ? goal.color : "text-slate-600"}`}
                >
                  {goal.label}
                </span>
                <div
                  className={`w-6 h-6 rounded-full border-2 ${selected === goal.id ? goal.border + " bg-white" : "border-slate-200"}`}
                />
              </div>
            </button>
          ))}
        </div>

        <div className="mt-12 flex gap-4">
          <Link href="/home" className="w-full">
            <button
              disabled={!selected}
              className={`btn-power w-full py-5 border-navy-dark text-white font-black text-lg transition-all ${
                selected
                  ? "bg-navy shadow-xl shadow-navy/20"
                  : "bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed"
              }`}
            >
              Initialize Path
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
