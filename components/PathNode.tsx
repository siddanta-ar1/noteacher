"use client";
import { motion } from "framer-motion";
import { Lock, Check } from "lucide-react";
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
  // Determine alignment based on position prop
  const alignmentClass =
    position === "left"
      ? "mr-auto ml-10"
      : position === "right"
        ? "ml-auto mr-10"
        : "mx-auto";

  return (
    <div
      className={`relative flex flex-col items-center w-full max-w-xs ${alignmentClass} mb-12`}
    >
      <Link href={status === "locked" ? "#" : `/lesson/${id}`}>
        <motion.div
          whileHover={status !== "locked" ? { scale: 1.1 } : {}}
          whileTap={{ scale: 0.95 }}
          className={`
            w-20 h-20 rounded-3xl flex items-center justify-center border-4 shadow-xl transition-all duration-500
            ${
              status === "completed"
                ? "bg-brand-accent border-brand-accent text-white"
                : status === "current"
                  ? "bg-brand-primary border-white text-white shadow-blue-500/50"
                  : "bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed"
            }
          `}
        >
          {status === "completed" ? (
            <Check size={32} strokeWidth={3} />
          ) : status === "locked" ? (
            <Lock size={28} />
          ) : (
            <span className="text-2xl font-bold">{index + 1}</span>
          )}
        </motion.div>
      </Link>

      <p
        className={`mt-4 font-semibold text-lg ${status === "locked" ? "text-slate-600" : "text-slate-200"}`}
      >
        {title}
      </p>
    </div>
  );
}
