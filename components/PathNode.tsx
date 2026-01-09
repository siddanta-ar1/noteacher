"use client";
import { motion } from "framer-motion";
import { Lock, Check, Play } from "lucide-react";
import Link from "next/link";

interface NodeProps {
  id: string;
  title: string;
  status: "locked" | "current" | "completed";
  position: "left" | "right" | "center";
  index: number;
}

export default function PathNode({
  id,
  title,
  status,
  position,
  index,
}: NodeProps) {
  const alignmentClass =
    position === "left"
      ? "mr-auto ml-10"
      : position === "right"
        ? "ml-auto mr-10"
        : "mx-auto";

  return (
    <div
      className={`relative flex flex-col items-center w-full max-w-xs ${alignmentClass} group`}
    >
      <Link href={status === "locked" ? "#" : `/lesson/${id}`}>
        <motion.div
          whileHover={status !== "locked" ? { scale: 1.05, y: -5 } : {}}
          whileTap={{ scale: 0.95 }}
          className={`
            w-24 h-24 rounded-[2rem] flex items-center justify-center border-b-8 transition-all duration-300
            ${
              status === "completed"
                ? "bg-power-teal border-teal-700 text-white shadow-lg shadow-power-teal/20"
                : status === "current"
                  ? "bg-navy border-navy-dark text-white shadow-xl shadow-navy/30"
                  : "bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed"
            }
          `}
        >
          {status === "completed" ? (
            <Check size={40} strokeWidth={4} />
          ) : status === "locked" ? (
            <Lock size={32} />
          ) : (
            <Play size={36} fill="currentColor" className="ml-1" />
          )}
        </motion.div>
      </Link>

      <div
        className={`mt-4 text-center bg-white px-6 py-2 rounded-2xl border-2 transition-all
        ${status === "locked" ? "border-slate-100 opacity-50" : "border-slate-200 shadow-sm group-hover:border-navy group-hover:shadow-md"}
      `}
      >
        <p
          className={`font-black text-sm tracking-tight ${status === "locked" ? "text-slate-400" : "text-slate-900"}`}
        >
          {title}
        </p>
        <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mt-0.5">
          {status === "completed"
            ? "Mastered"
            : status === "current"
              ? "In Progress"
              : "Locked"}
        </p>
      </div>
    </div>
  );
}
