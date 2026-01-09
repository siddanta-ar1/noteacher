"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Image as ImageIcon,
  Send,
  Sparkles,
  CheckCircle2,
  X,
} from "lucide-react";

export default function AssignmentSection() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<
    "idle" | "uploading" | "grading" | "success"
  >("idle");

  const handleSubmit = () => {
    setStatus("uploading");
    // Simulate AI Grading Flow
    setTimeout(() => setStatus("grading"), 1500);
    setTimeout(() => setStatus("success"), 4000);
  };

  return (
    <section className="mt-20 border-t-4 border-slate-100 pt-20 pb-32">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-power-orange rounded-2xl flex items-center justify-center shadow-lg shadow-power-orange/20">
            <Send className="text-white w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900">
              Mandatory Assignment
            </h3>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">
              Logic Gate Mastery
            </p>
          </div>
        </div>

        <div className="bg-slate-50 border-2 border-slate-200 rounded-[2.5rem] p-8">
          <p className="text-lg font-bold text-slate-700 mb-6">
            Draw a circuit that implements an{" "}
            <span className="text-navy">OR gate</span> using only{" "}
            <span className="text-power-purple">NAND gates</span>. Upload a
            photo of your sketch below.
          </p>

          {/* Upload Area */}
          <div
            className={`relative border-4 border-dashed rounded-3xl p-12 transition-all flex flex-col items-center justify-center gap-4
              ${file ? "border-power-teal bg-power-teal/5" : "border-slate-200 hover:border-navy hover:bg-slate-100/50"}
            `}
          >
            {file ? (
              <div className="text-center">
                <div className="relative inline-block">
                  <ImageIcon className="w-16 h-16 text-power-teal mb-2" />
                  <button
                    onClick={() => setFile(null)}
                    className="absolute -top-2 -right-2 bg-white border-2 border-slate-200 rounded-full p-1 text-slate-400 hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                </div>
                <p className="text-sm font-black text-slate-900">{file.name}</p>
              </div>
            ) : (
              <>
                <div className="p-4 bg-white rounded-full shadow-sm text-slate-400">
                  <Upload size={32} />
                </div>
                <div className="text-center">
                  <p className="font-black text-slate-900">
                    Drop your photo here
                  </p>
                  <p className="text-xs font-bold text-slate-400 uppercase mt-1">
                    or click to browse
                  </p>
                </div>
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={handleSubmit}
            disabled={!file || status !== "idle"}
            className={`w-full mt-8 py-5 rounded-2xl font-black text-lg transition-all border-b-8 flex items-center justify-center gap-3
              ${
                status === "success"
                  ? "bg-power-teal border-teal-700 text-white"
                  : file
                    ? "bg-navy border-navy-dark text-white active:translate-y-1 active:border-b-4"
                    : "bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed"
              }
            `}
          >
            {status === "idle" && (
              <>
                <Sparkles size={20} /> Submit for AI Grading
              </>
            )}
            {status === "uploading" && "Uploading Sketch..."}
            {status === "grading" && "AI Teacher is Analyzing..."}
            {status === "success" && (
              <>
                <CheckCircle2 size={20} /> Assignment Perfected!
              </>
            )}
          </button>
        </div>

        {/* AI Feedback Reveal */}
        <AnimatePresence>
          {status === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 bg-power-teal/10 border-2 border-power-teal rounded-3xl p-6"
            >
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-power-teal rounded-full flex items-center justify-center shrink-0">
                  <Sparkles size={18} className="text-white" />
                </div>
                <div>
                  <h4 className="font-black text-power-teal uppercase text-xs tracking-widest mb-1">
                    AI Teacher Feedback
                  </h4>
                  <p className="text-slate-700 font-medium">
                    Excellent work! Your use of the De Morgan's Law equivalent
                    for the OR gate is correct. You've successfully unlocked the
                    next node in the path!
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
