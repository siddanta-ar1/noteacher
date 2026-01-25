"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Image as ImageIcon } from "lucide-react";
import QuizBlock from "./blocks/QuizBlock";
import AssignmentBlock from "./blocks/AssignmentBlock"; // Import the new block
import Workbench from "@/components/simulator/Workbench";
import StatisticsVisualizer from "@/components/lesson/visualizers/StatisticsVisualizer";

// --- TYPES ---
export type LessonBlock = {
  id: string;
  type: "text" | "simulation" | "quiz" | "image" | "assignment";
  content?: string;
  data?: any;
};

type LessonRendererProps = {
  blocks: LessonBlock[];
  onUpdateContext?: (text: string) => void;
};

export default function LessonRenderer({
  blocks,
  onUpdateContext,
}: LessonRendererProps) {
  const [unlockedIndex, setUnlockedIndex] = useState(0);

  const handleUnlock = (index: number) => {
    // Only unlock if we are at the current boundary
    if (index >= unlockedIndex) {
      setUnlockedIndex(index + 1);
    }
  };

  return (
    <div className="space-y-16 max-w-3xl mx-auto pb-24">
      {blocks.map((block, index) => {
        // SCROLL BLOCKER: Hide content beyond the unlocked index
        const isLocked = index > unlockedIndex;
        if (isLocked) return null;

        return (
          <motion.div
            key={block.id || index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            {/* 1. TEXT */}
            {block.type === "text" && (
              <TextBlock content={block.content || ""} />
            )}

            {/* 2. IMAGE (New) */}
            {block.type === "image" && (
              <div className="relative rounded-[2rem] overflow-hidden shadow-lg border-4 border-white bg-slate-100 aspect-video flex items-center justify-center">
                {block.content ? (
                  <img
                    src={block.content}
                    alt="Visual"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center text-slate-300">
                    <ImageIcon size={48} />
                    <span className="font-bold text-xs uppercase mt-2">
                      Visual Placeholder
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* 3. SIMULATION */}
            {block.type === "simulation" && (
              <div className="h-[500px] w-full bg-slate-900 rounded-3xl overflow-hidden border-4 border-slate-100 shadow-xl relative z-10">
                {block.data?.type === "logic-gates" ? (
                  <Workbench />
                ) : block.data?.type === "statistics" ? (
                  <StatisticsVisualizer
                    mode={block.data?.mode || "chaos"}
                    trigger={true}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-white">
                    Engine Loading...
                  </div>
                )}
              </div>
            )}

            {/* 4. QUIZ */}
            {block.type === "quiz" && (
              <QuizBlock
                question={block.content || "Question?"}
                options={block.data?.options || []}
                correctIndex={block.data?.correctIndex || 0}
                onComplete={() => handleUnlock(index)}
              />
            )}

            {/* 5. ASSIGNMENT (New) */}
            {block.type === "assignment" && (
              <AssignmentBlock
                title={block.data?.title || "Project Upload"}
                description={block.content || "Upload your work to continue."}
                onComplete={() => handleUnlock(index)}
              />
            )}

            {/* AI Context Injector */}
            <motion.div
              onViewportEnter={() =>
                onUpdateContext?.(block.content || block.type)
              }
              className="absolute inset-0 pointer-events-none"
            />
          </motion.div>
        );
      })}

      {/* LOCKED INDICATOR */}
      {unlockedIndex < blocks.length && (
        <div className="py-12 flex flex-col items-center justify-center text-slate-400 opacity-50">
          <Lock className="w-8 h-8 mb-2" />
          <p className="text-sm font-bold uppercase tracking-widest">
            Complete the task above to continue
          </p>
        </div>
      )}
    </div>
  );
}

function TextBlock({ content }: { content: string }) {
  // Minimal Markdown parsing for bold text
  const parts = content.split(/(\*\*.*?\*\*)/g);
  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
      <p className="text-xl md:text-2xl text-slate-700 leading-relaxed font-medium font-sans">
        {parts.map((part, i) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <span key={i} className="font-black text-navy">
              {part.slice(2, -2)}
            </span>
          ) : (
            part
          ),
        )}
      </p>
    </div>
  );
}
