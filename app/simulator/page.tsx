"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Play,
  Trash2,
  Plus,
  ChevronLeft,
  Info,
  Cpu,
  MousePointer2,
  Target,
  Send,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export default function SimulatorPage() {
  const [gradingStatus, setGradingStatus] = useState<
    "idle" | "grading" | "success"
  >("idle");
  const [showTask, setShowTask] = useState(true);

  const handleSubmission = () => {
    setGradingStatus("grading");
    // Simulate AI logic check
    setTimeout(() => setGradingStatus("success"), 3000);
  };

  return (
    <div className="h-screen bg-slate-950 flex flex-col overflow-hidden selection:bg-power-teal/30">
      {/* 1. Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center px-8 z-50">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="p-2 bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-white font-black text-lg flex items-center gap-2">
              <Cpu className="text-power-teal" size={18} />
              Logic Lab: <span className="text-power-teal">NAND Universe</span>
            </h1>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-700">
            <Trash2 size={16} className="inline mr-2" /> Clear
          </button>
          <button
            onClick={handleSubmission}
            className="px-6 py-2 bg-power-teal text-white rounded-xl font-black text-sm shadow-lg shadow-power-teal/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Play size={16} fill="white" className="inline mr-2" /> Run
            Simulation
          </button>
        </div>
      </header>

      <div className="flex-1 flex relative">
        {/* 2. Assignment HUD (Pinned Task) */}
        <AnimatePresence>
          {showTask && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 20, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="absolute top-6 left-6 w-80 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-[2rem] p-6 z-40 shadow-2xl"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <Target className="text-power-orange" size={18} />
                  <span className="text-[10px] font-black text-power-orange uppercase tracking-widest">
                    Active Task
                  </span>
                </div>
                <button
                  onClick={() => setShowTask(false)}
                  className="text-slate-500 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <h3 className="text-white font-black text-lg mb-2">
                Build a NOT Gate
              </h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed mb-6">
                Connect both inputs of a{" "}
                <span className="text-navy font-bold underline">NAND Gate</span>{" "}
                to a single Input Node.
              </p>

              <button
                onClick={handleSubmission}
                disabled={gradingStatus !== "idle"}
                className={`w-full py-4 rounded-2xl font-black text-sm border-b-4 flex items-center justify-center gap-2 transition-all
                    ${
                      gradingStatus === "success"
                        ? "bg-power-teal border-teal-700 text-white"
                        : "bg-navy border-navy-dark text-white hover:scale-[1.02] active:translate-y-1 active:border-b-0"
                    }
                  `}
              >
                {gradingStatus === "idle" && (
                  <>
                    <Send size={16} /> Submit for Grading
                  </>
                )}
                {gradingStatus === "grading" && (
                  <>
                    <Sparkles size={16} className="animate-spin" /> AI
                    Analyzing...
                  </>
                )}
                {gradingStatus === "success" && (
                  <>
                    <CheckCircle2 size={16} /> Mastery Verified
                  </>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. Toolbox (Left) */}
        <aside className="w-72 bg-slate-900 border-r border-slate-800 p-6 space-y-8 overflow-y-auto">
          <div>
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">
              Inputs
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-slate-800 border border-slate-700 rounded-2xl text-[10px] font-black text-center text-slate-400 uppercase">
                Input A
              </div>
              <div className="p-4 bg-slate-800 border border-slate-700 rounded-2xl text-[10px] font-black text-center text-slate-400 uppercase">
                Input B
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">
              Gates
            </h3>
            <div className="space-y-3">
              <div className="p-5 bg-navy border-b-4 border-navy-dark rounded-2xl text-white font-black text-center text-xs">
                NAND GATE
              </div>
              <div className="p-5 bg-slate-800 border border-slate-700 rounded-2xl text-slate-500 font-black text-center text-xs opacity-50">
                AND GATE (Locked)
              </div>
            </div>
          </div>
        </aside>

        {/* 4. Canvas (Center) */}
        <main className="flex-1 relative bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px]">
          <motion.div
            drag
            dragMomentum={false}
            className="absolute top-1/3 left-1/4 p-6 bg-slate-800 border-2 border-navy rounded-[2rem] shadow-2xl cursor-grab"
          >
            <div className="flex items-center gap-6">
              <div className="space-y-4">
                <div className="w-3 h-3 bg-slate-700 rounded-full border border-slate-600" />
                <div className="w-3 h-3 bg-slate-700 rounded-full border border-slate-600" />
              </div>
              <div className="w-16 h-12 bg-navy rounded-xl flex items-center justify-center font-black text-white text-xs">
                NAND
              </div>
              <div className="w-3 h-3 bg-slate-700 rounded-full border border-slate-600" />
            </div>
          </motion.div>
        </main>

        {/* 5. Success Overlay Modal */}
        <AnimatePresence>
          {gradingStatus === "success" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-navy/20 backdrop-blur-md z-[60] flex items-center justify-center p-6"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="bg-white rounded-[3rem] p-12 max-w-lg text-center shadow-3xl border-b-[12px] border-slate-100"
              >
                <div className="w-20 h-20 bg-power-teal rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-power-teal/20 text-white">
                  <CheckCircle2 size={40} strokeWidth={3} />
                </div>
                <h2 className="text-4xl font-black text-slate-900 mb-4">
                  Challenge Solved!
                </h2>
                <p className="text-slate-500 font-bold mb-8">
                  Your circuit successfully inverted the signal using NAND
                  logic. Earned <span className="text-power-teal">500 XP</span>.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setGradingStatus("idle")}
                    className="flex-1 py-4 bg-slate-100 text-slate-400 rounded-2xl font-black"
                  >
                    Retry
                  </button>
                  <Link
                    href="/"
                    className="flex-[2] py-4 bg-navy text-white rounded-2xl font-black border-b-4 border-navy-dark text-center"
                  >
                    Back to Path
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
