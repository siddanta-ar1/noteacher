"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Settings2,
  Gauge,
  Sparkles,
} from "lucide-react";

type ControlBarProps = {
  isScrolling: boolean;
  onToggleScroll: () => void;
  scrollSpeed: number;
  onSpeedChange: (speed: number) => void;
  isReading: boolean;
  onToggleRead: () => void;
  onOpenAI: () => void;
};

export default function LessonControlBar({
  isScrolling,
  onToggleScroll,
  scrollSpeed,
  onSpeedChange,
  isReading,
  onToggleRead,
  onOpenAI,
}: ControlBarProps) {
  const [showSpeed, setShowSpeed] = useState(false);

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 bg-navy/90 backdrop-blur-md text-white p-2 rounded-full shadow-2xl border border-white/10 flex items-center gap-2"
    >
      {/* 1. AUTO SCROLL TOGGLE */}
      <button
        onClick={onToggleScroll}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
          isScrolling ? "bg-power-teal text-white" : "hover:bg-white/10"
        }`}
        title="Auto-Scroll"
      >
        {isScrolling ? (
          <Pause size={20} fill="currentColor" />
        ) : (
          <Play size={20} fill="currentColor" className="ml-1" />
        )}
      </button>

      {/* 2. SPEED CONTROLLER */}
      <div className="relative">
        <button
          onClick={() => setShowSpeed(!showSpeed)}
          className="w-12 h-12 rounded-full hover:bg-white/10 flex items-center justify-center text-slate-300"
          title="Scroll Speed"
        >
          <Gauge size={20} />
          {/* Speed Indicator Badge */}
          <span className="absolute top-0 right-0 bg-power-orange text-[9px] font-black px-1 rounded-full text-navy">
            {scrollSpeed}x
          </span>
        </button>

        <AnimatePresence>
          {showSpeed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: -10 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white rounded-xl p-2 shadow-xl flex flex-col gap-1"
            >
              {[0.5, 1, 1.5, 2].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    onSpeedChange(s);
                    setShowSpeed(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    scrollSpeed === s
                      ? "bg-navy text-white"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {s}x
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-px h-6 bg-white/20 mx-1" />

      {/* 3. READ ALOUD TOGGLE */}
      <button
        onClick={onToggleRead}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
          isReading ? "bg-white text-navy" : "hover:bg-white/10 text-slate-300"
        }`}
        title="Read Aloud"
      >
        {isReading ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>

      <div className="w-px h-6 bg-white/20 mx-1" />

      {/* 4. AI TEACHER */}
      <button
        onClick={onOpenAI}
        className="px-5 h-12 rounded-full bg-gradient-to-r from-power-purple to-indigo-600 flex items-center gap-2 font-bold hover:brightness-110 transition-all shadow-lg shadow-power-purple/20"
      >
        <Sparkles size={16} className="text-white" />
        <span className="hidden md:inline">Ask AI</span>
      </button>
    </motion.div>
  );
}
