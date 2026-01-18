"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  ChevronLeft,
  Volume2,
  Sparkles,
  Layout,
  CheckCircle2,
  ArrowRight,
  ScrollText, // Icon for Auto-Scroll
  Cpu, // Icon for Simulator
  Pause, // Icon to stop Auto-Scroll
  ClipboardCheck, // Icon for Quiz/Assignment
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AIChatModal from "@/components/lesson/AIChatModal";
import ReadingEngine from "@/components/lesson/ReadingEngine";
import { completeNode } from "@/app/lesson/actions";
import AssignmentSection from "@/components/lesson/AssignmentSection";

type LessonClientProps = {
  node: {
    id: string;
    title: string;
    type: string;
    content: {
      segments?: string[];
      task?: string;
    };
  };
  courseNodes: any[];
  userProgress: any[];
};

export default function LessonClient({
  node,
  courseNodes,
  userProgress,
}: LessonClientProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  // Feature States
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { scrollYProgress } = useScroll({ container: containerRef });
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // ---------------------------------------------------------------------------
  // 1. AUTO-SCROLL ENGINE
  // ---------------------------------------------------------------------------
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoScrolling && containerRef.current) {
      interval = setInterval(() => {
        if (containerRef.current) {
          containerRef.current.scrollBy({ top: 1, behavior: "smooth" });

          // Stop if reached bottom
          if (
            containerRef.current.scrollTop +
              containerRef.current.clientHeight >=
            containerRef.current.scrollHeight - 10
          ) {
            setIsAutoScrolling(false);
          }
        }
      }, 30); // Speed: 30ms per pixel
    }
    return () => clearInterval(interval);
  }, [isAutoScrolling]);

  const handleComplete = async () => {
    setIsCompleting(true);
    await completeNode(node.id);
    router.push("/home");
    setIsCompleting(false);
  };

  const scrollToSimulator = () => {
    const simElement = document.getElementById("simulator-section");
    simElement?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar (Kept same) */}
      <aside className="hidden lg:flex w-80 bg-slate-50 border-r border-slate-200 flex-col h-full z-20">
        <div className="p-6 border-b border-slate-200 bg-white">
          <Link
            href="/home"
            className="flex items-center gap-2 text-slate-400 hover:text-navy transition-colors mb-4 text-sm font-bold"
          >
            <ChevronLeft size={16} /> Back to Dashboard
          </Link>
          <h2 className="text-xl font-black text-slate-900">{node.title}</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {courseNodes.map((n) => {
            const status =
              userProgress.find((p) => p.node_id === n.id)?.status ||
              (n.position_index === 1 ? "unlocked" : "locked");
            const isCurrent = n.id === node.id;
            return (
              <div
                key={n.id}
                className={`flex items-center gap-3 p-4 rounded-2xl transition-all border-2
                ${isCurrent ? "bg-white border-navy shadow-sm" : "border-transparent opacity-80"}
                ${status === "locked" ? "grayscale opacity-50" : ""}
              `}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0
                  ${status === "completed" ? "bg-power-teal text-white" : isCurrent ? "bg-navy text-white" : "bg-slate-200"}
                `}
                >
                  {status === "completed" ? (
                    <CheckCircle2 size={14} />
                  ) : (
                    <div className="w-1.5 h-1.5 bg-current rounded-full" />
                  )}
                </div>
                <span className="text-sm font-bold text-slate-900">
                  {n.title}
                </span>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Main Content */}
      <main
        ref={containerRef}
        className="flex-1 relative overflow-y-auto scroll-smooth bg-white"
      >
        <motion.div
          className="fixed top-0 left-0 lg:left-80 right-0 h-1.5 bg-power-teal origin-left z-50"
          style={{ scaleX }}
        />

        {/* ------------------------------------------------------------------ */}
        {/* 2. THE FLOATING COMMAND BAR (With requested Icons) */}
        {/* ------------------------------------------------------------------ */}
        <div className="sticky top-6 float-right mr-6 md:mr-10 z-40 flex flex-col gap-3">
          {/* Read Aloud */}
          <ControlButton
            icon={Volume2}
            tooltip="Read Aloud"
            onClick={() => alert("Text-to-Speech Initializing...")}
          />

          {/* Auto Scroll */}
          <ControlButton
            icon={isAutoScrolling ? Pause : ScrollText}
            isActive={isAutoScrolling}
            tooltip={isAutoScrolling ? "Pause Scroll" : "Auto Scroll"}
            onClick={() => setIsAutoScrolling(!isAutoScrolling)}
          />

          {/* Jump to Assignment/Simulator (Only if assignment exists) */}
          {node.type === "assignment" && (
            <ControlButton
              icon={Cpu}
              tooltip="Go to Simulator"
              onClick={scrollToSimulator}
              color="text-power-teal"
            />
          )}
        </div>

        <article className="max-w-3xl mx-auto py-24 px-6 md:px-12 space-y-20">
          <section className="text-center md:text-left">
            <span className="bg-power-teal/10 text-power-teal px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
              {node.type}
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mt-6 leading-[1.1] tracking-tight">
              {node.title}
            </h1>
          </section>

          <ReadingEngine content={node.content} />

          {/* Simulator Call to Action */}
          {node.type === "assignment" && (
            <AssignmentSection
              title={node.title}
              task={node.content.task || "Complete the circuit challenge."}
              isCompleted={isCompleting} // Or check userProgress
            />
          )}

          <div className="pt-20 pb-32 flex justify-center">
            <button
              onClick={handleComplete}
              disabled={isCompleting}
              className="group relative px-12 py-6 bg-power-teal text-white rounded-3xl font-black text-xl shadow-xl shadow-power-teal/30 hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 transition-all flex items-center gap-3 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                {isCompleting ? "Synchronizing..." : "Complete & Continue"}{" "}
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          </div>
        </article>
      </main>

      {/* AI Assistant Button (Floating Bottom Right) */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 w-14 h-14 md:w-16 md:h-16 bg-navy rounded-full shadow-2xl flex items-center justify-center text-white border-4 border-white z-50 hover:bg-navy-dark transition-colors"
      >
        <Sparkles size={24} />
      </motion.button>

      <AIChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. REUSABLE TOOLBAR BUTTON COMPONENT
// ---------------------------------------------------------------------------
function ControlButton({
  icon: Icon,
  onClick,
  isActive = false,
  tooltip,
  color = "text-navy",
}: {
  icon: any;
  onClick?: () => void;
  isActive?: boolean;
  tooltip: string;
  color?: string;
}) {
  return (
    <div className="group/btn relative flex items-center justify-end">
      {/* Tooltip */}
      <span className="absolute right-full mr-3 px-3 py-1 bg-slate-800 text-white text-xs font-bold rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {tooltip}
      </span>

      <button
        onClick={onClick}
        className={`w-12 h-12 rounded-2xl shadow-lg border flex items-center justify-center transition-all
          ${
            isActive
              ? "bg-power-teal text-white border-power-teal shadow-power-teal/30"
              : `bg-white ${color} border-slate-100 hover:bg-slate-50 hover:scale-105`
          }
        `}
      >
        <Icon size={20} className={isActive ? "animate-pulse" : ""} />
      </button>
    </div>
  );
}
