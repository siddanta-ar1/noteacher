// components/PathMap.tsx
"use client";
import { motion } from "framer-motion";
import { Check, Lock, Play } from "lucide-react";

const nodes = [
  { id: 1, title: "Binary Basics", status: "completed" },
  { id: 2, title: "The CPU Core", status: "current" },
  { id: 3, title: "Logic Gates", status: "locked" },
];

export default function PathMap() {
  return (
    <div className="max-w-xl mx-auto py-12 relative">
      {/* Central Connector Line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-slate-100 -translate-x-1/2" />

      <div className="space-y-20 relative z-10">
        {nodes.map((node, i) => (
          <div
            key={node.id}
            className={`flex items-center gap-8 ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
          >
            <div className="flex-1 text-right">
              {i % 2 !== 0 && (
                <NodeLabel title={node.title} status={node.status} />
              )}
            </div>

            <motion.div
              whileHover={{ scale: 1.1 }}
              className={`w-20 h-20 rounded-full flex items-center justify-center border-8 shadow-sm transition-all
                ${
                  node.status === "completed"
                    ? "bg-brand-accent border-emerald-100 text-white"
                    : node.status === "current"
                      ? "bg-brand-primary border-blue-100 text-white shadow-blue-200"
                      : "bg-slate-50 border-slate-100 text-slate-300"
                }
              `}
            >
              {node.status === "completed" ? (
                <Check size={32} strokeWidth={3} />
              ) : node.status === "locked" ? (
                <Lock size={24} />
              ) : (
                <Play size={28} fill="currentColor" />
              )}
            </motion.div>

            <div className="flex-1">
              {i % 2 === 0 && (
                <NodeLabel title={node.title} status={node.status} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NodeLabel({ title, status }: { title: string; status: string }) {
  return (
    <div
      className={`px-6 py-3 rounded-2xl border ${status === "locked" ? "bg-slate-50 border-slate-100" : "bg-white border-slate-200 shadow-sm"}`}
    >
      <h4
        className={`font-bold ${status === "locked" ? "text-slate-400" : "text-slate-900"}`}
      >
        {title}
      </h4>
      <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
        {status === "completed"
          ? "Mastered"
          : status === "current"
            ? "In Progress"
            : "Locked"}
      </p>
    </div>
  );
}
