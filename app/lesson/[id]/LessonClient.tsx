"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// --- COMPONENTS ---
import LessonRenderer, {
  LessonBlock,
} from "@/components/lesson/LessonRenderer";
import LessonControlBar from "@/components/lesson/LessonControlBar";
import AIChatModal from "@/components/lesson/AIChatModal"; // <--- ADDED THIS IMPORT
import { completeNode } from "@/app/lesson/actions";

// --- ADAPTER UTILS ---
const normalizeContent = (
  nodeContent: any,
  nodeType: string,
): LessonBlock[] => {
  if (Array.isArray(nodeContent)) return nodeContent;
  const blocks: LessonBlock[] = [];
  if (nodeContent?.segments) {
    nodeContent.segments.forEach((seg: string, i: number) => {
      blocks.push({ id: `txt-${i}`, type: "text", content: seg });
      if (i === 1 && nodeType === "assignment") {
        blocks.push({
          id: "sim-1",
          type: "simulation",
          data: { type: "logic-gates" },
        });
      }
    });
  } else if (nodeContent?.task) {
    blocks.push({ id: "task-1", type: "text", content: nodeContent.task });
  }
  if (nodeContent?.visualizerMode) {
    blocks.push({
      id: "vis-1",
      type: "simulation",
      data: { type: "statistics", mode: nodeContent.visualizerMode },
    });
  }
  // Fallback Quiz if needed
  if (
    !blocks.find((b) => b.type === "quiz") &&
    !blocks.find((b) => b.type === "assignment")
  ) {
    blocks.push({
      id: "quiz-final",
      type: "quiz",
      content: "What is the key takeaway?",
      data: {
        options: ["Concept A", "Concept B", "Concept C"],
        correctIndex: 0,
      },
    });
  }
  return blocks;
};

type LessonClientProps = {
  node: { id: string; title: string; type: string; content: any };
  courseNodes: any[];
  userProgress: any[];
};

export default function LessonClient({
  node,
  courseNodes,
  userProgress,
}: LessonClientProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // --- STATE ---
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentContext, setCurrentContext] = useState("");

  // Reading Engine State
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(1);
  const [isReading, setIsReading] = useState(false);

  const blocks = normalizeContent(node.content, node.type);

  // --- AUTO SCROLL ENGINE ---
  useEffect(() => {
    let animationFrameId: number;

    const scroll = () => {
      if (containerRef.current && isScrolling) {
        containerRef.current.scrollTop += 0.5 * scrollSpeed;

        if (
          containerRef.current.scrollTop + containerRef.current.clientHeight >=
          containerRef.current.scrollHeight - 10
        ) {
          setIsScrolling(false);
        } else {
          animationFrameId = requestAnimationFrame(scroll);
        }
      }
    };

    if (isScrolling) {
      animationFrameId = requestAnimationFrame(scroll);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [isScrolling, scrollSpeed]);

  // --- TEXT TO SPEECH ENGINE ---
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const toggleReader = () => {
    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
    } else {
      const fullText = blocks
        .filter((b) => b.type === "text")
        .map((b) => b.content)
        .join(". ");

      const utterance = new SpeechSynthesisUtterance(fullText);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.onend = () => setIsReading(false);

      window.speechSynthesis.speak(utterance);
      setIsReading(true);
    }
  };

  // --- COMPLETION LOGIC ---
  const handleComplete = async () => {
    try {
      const result = await completeNode(node.id);
      if (result.success) {
        if (result.nextNodeId) router.push(`/lesson/${result.nextNodeId}`);
        else router.push("/home");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      {/* SIDEBAR */}
      <aside className="hidden lg:flex w-80 bg-surface-raised border-r border-border flex-col h-full z-20">
        <div className="p-6 border-b border-border bg-surface">
          <Link
            href="/home"
            className="flex items-center gap-2 text-slate-400 hover:text-navy text-sm font-bold"
          >
            <ChevronLeft size={16} /> Dashboard
          </Link>
          <h2 className="text-xl font-black text-slate-900 mt-4">
            {node.title}
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {courseNodes.map((n) => {
            const isDone =
              userProgress.find((p) => p.node_id === n.id)?.status ===
              "completed";
            const isCurrent = n.id === node.id;
            return (
              <div
                key={n.id}
                className={`p-3 rounded-xl text-sm font-bold border-l-4 ${isCurrent ? "bg-surface border-navy shadow-sm" : "border-transparent opacity-60"}`}
              >
                {n.title} {isDone && "✓"}
              </div>
            );
          })}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main
        ref={containerRef}
        className="flex-1 relative overflow-y-auto scroll-smooth bg-surface"
      >
        <motion.div
          className="fixed top-0 left-0 lg:left-80 right-0 h-1.5 bg-power-teal origin-left z-50"
          style={{ scaleX }}
        />

        <article className="max-w-4xl mx-auto py-24 px-6 md:px-12 pb-48">
          <header className="mb-16 text-center md:text-left">
            <span className="bg-power-teal/10 text-power-teal px-3 py-1 rounded-full text-xs font-black uppercase">
              {node.type}
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-ink-900 mt-4">
              {node.title}
            </h1>
          </header>

          <LessonRenderer
            blocks={blocks}
            onUpdateContext={(ctx) => setCurrentContext(ctx)}
          />

          <div className="pt-24 pb-32 flex justify-center">
            <button
              onClick={handleComplete}
              className="px-10 py-5 bg-navy text-white rounded-2xl font-black text-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
            >
              Complete Unit
            </button>
          </div>
        </article>
      </main>

      {/* FLOATING CONTROL BAR */}
      <LessonControlBar
        isScrolling={isScrolling}
        onToggleScroll={() => setIsScrolling(!isScrolling)}
        scrollSpeed={scrollSpeed}
        onSpeedChange={setScrollSpeed}
        isReading={isReading}
        onToggleRead={toggleReader}
        onOpenAI={() => setIsChatOpen(true)}
      />

      {/* AI CHAT */}
      <AIChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        context={`Currently viewing: ${currentContext} \n\n Lesson: ${node.title}`}
      />
    </div>
  );
}
