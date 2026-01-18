"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Zap } from "lucide-react";

type ReadingEngineProps = {
  content: {
    segments?: string[]; // Optional now
    task?: string; // Optional (for assignments)
  };
};

export default function ReadingEngine({ content }: ReadingEngineProps) {
  // SAFETY FIX: Determine what text to show based on available data
  const segments = content?.segments || (content?.task ? [content.task] : []);

  if (!segments.length) return null;

  return (
    <div className="space-y-12 max-w-3xl mx-auto">
      {segments.map((segment, index) => (
        <AnimatedBlock key={index} text={segment} index={index} />
      ))}
    </div>
  );
}

function AnimatedBlock({ text, index }: { text: string; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.8,
        ease: [0.2, 0.65, 0.3, 0.9],
        delay: index * 0.1,
      }}
      className="relative group"
    >
      {/* Decorative Line for the first item */}
      {index === 0 && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "100%" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute -left-6 top-2 w-1 bg-gradient-to-b from-power-teal to-transparent rounded-full opacity-50"
        />
      )}

      {/* The Text Card */}
      <div className="bg-white/50 backdrop-blur-sm p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
        <p className="text-xl md:text-2xl text-slate-700 leading-relaxed font-medium font-sans">
          {text}
        </p>
      </div>

      {/* Little connector icon between segments */}
      <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 opacity-20 group-last:hidden">
        <Zap size={20} className="text-slate-400" />
      </div>
    </motion.div>
  );
}
