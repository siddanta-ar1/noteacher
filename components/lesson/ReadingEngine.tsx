"use client";
import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Play, Pause, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ReadingEngineProps {
  contentRefs: React.RefObject<HTMLElement[]>;
  textSegments: string[];
}

export default function ReadingEngine({
  contentRefs,
  textSegments,
}: ReadingEngineProps) {
  const [isReading, setIsReading] = useState(false);
  const [currentSegment, setCurrentSegment] = useState(0);
  const synth = useRef<SpeechSynthesis | null>(null);
  const utterance = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    synth.current = window.speechSynthesis;
    return () => synth.current?.cancel();
  }, []);

  const stopReading = () => {
    synth.current?.cancel();
    setIsReading(false);
  };

  const startReading = (index: number) => {
    if (!synth.current) return;
    synth.current.cancel();

    const text = textSegments[index];
    utterance.current = new SpeechSynthesisUtterance(text);

    // NOTEacher Voice Profile
    utterance.current.rate = 0.95; // Slightly slower for clarity
    utterance.current.pitch = 1.1; // Friendly tone

    utterance.current.onstart = () => {
      setIsReading(true);
      // Auto-scroll logic: Bring the current section into view smoothly
      contentRefs.current?.[index]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    };

    utterance.current.onend = () => {
      if (index < textSegments.length - 1) {
        setCurrentSegment(index + 1);
        startReading(index + 1);
      } else {
        setIsReading(false);
      }
    };

    synth.current.speak(utterance.current);
  };

  const toggleReading = () => {
    if (isReading) {
      stopReading();
    } else {
      startReading(currentSegment);
    }
  };

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
      <motion.div
        layout
        className="bg-white border-2 border-slate-200 rounded-[2rem] p-3 shadow-2xl flex items-center gap-4"
      >
        <button
          onClick={toggleReading}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border-b-4
            ${isReading ? "bg-power-orange border-orange-700 text-white" : "bg-navy border-navy-dark text-white"}
          `}
        >
          {isReading ? <Pause size={20} /> : <Volume2 size={20} />}
        </button>

        <div className="pr-6">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-0.5">
            {isReading ? "NOTEacher is Reading" : "Auto-Scroll & Read"}
          </p>
          <p className="text-sm font-black text-slate-900">
            {isReading
              ? `Section ${currentSegment + 1} of ${textSegments.length}`
              : "Start Audio Guide"}
          </p>
        </div>

        <AnimatePresence>
          {isReading && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="flex gap-1 pr-4"
            >
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  animate={{ height: [8, 16, 8] }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.5,
                    delay: i * 0.1,
                  }}
                  className="w-1 bg-power-teal rounded-full"
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
