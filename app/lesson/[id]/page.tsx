"use client";
import { useState, useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  ChevronLeft,
  Volume2,
  Sparkles,
  Layout,
  CheckCircle2,
  Play,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import AssignmentSection from "@/components/lesson/AssignmentSection";
import AIChatModal from "@/components/lesson/AIChatModal";
import ReadingEngine from "@/components/lesson/ReadingEngine";

export default function LessonPage({ params }: { params: { id: string } }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const containerRef = useRef(null);
  const sectionRefs = useRef<HTMLElement[]>([]);
  const lessonText = [
    "The NAND gate is considered Universal because any other boolean function can be implemented using only NAND gates.",
    "To create a NOT gate from a NAND, you simply tie both inputs of the NAND together.",
    "Your mandatory assignment is to draw a circuit using only NAND gates.",
  ];

  // Scrollytelling Progress Bar
  const { scrollYProgress } = useScroll({
    container: containerRef,
  });
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* 1. Left Sidebar: Sequential Subtopics */}
      <aside className="w-80 bg-slate-50 border-r border-slate-200 flex flex-col h-full z-20">
        <div className="p-6 border-b border-slate-200 bg-white">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-400 hover:text-navy transition-colors mb-4 group font-bold text-sm"
          >
            <ChevronLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Path
          </Link>
          <h2 className="text-xl font-black text-slate-900 leading-tight">
            NAND Gate Challenges
          </h2>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-1.5 flex-1 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-power-teal w-1/3" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase">
              33% Complete
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <SubtopicItem title="Introduction" status="completed" />
          <SubtopicItem title="The Universal Gate" status="current" />
          <SubtopicItem title="Building a NOT Gate" status="locked" />
          <SubtopicItem title="The Truth Table Master" status="locked" />
          <SubtopicItem title="Final Assignment" status="assignment" />
        </div>
      </aside>

      {/* 2. Main Scrollytelling Area */}
      <main
        ref={containerRef}
        className="flex-1 relative overflow-y-auto scroll-smooth"
      >
        {/* Top Reading Progress Bar */}
        <motion.div
          className="fixed top-0 left-80 right-0 h-1.5 bg-power-teal origin-left z-50"
          style={{ scaleX }}
        />

        {/* Floating Power Controls */}
        <div className="sticky top-6 float-right mr-10 z-40 flex flex-col gap-3">
          <ControlButton
            icon={Volume2}
            label="Auto-Scroll & Read"
            color="bg-power-purple"
          />
          <ControlButton
            icon={Sparkles}
            label="AI Summary"
            color="bg-power-orange"
          />
          <ControlButton
            icon={Layout}
            label="Open Simulator"
            color="bg-power-teal"
          />
        </div>

        <article className="max-w-3xl mx-auto py-24 px-12 space-y-20">
          {/* Section 1 */}
          <section className="space-y-6">
            <span className="bg-power-teal/10 text-power-teal px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
              Topic 02: Universal Power
            </span>
            <h1 className="text-5xl font-black text-slate-900 leading-[1.1]">
              The NAND Utility
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed font-medium">
              The NAND gate is considered 'Universal' because any other boolean
              function can be implemented using only NAND gates. This is the
              foundation of modern chip design.
            </p>
          </section>

          {/* Scrollytelling Component: Interactive Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="aspect-video bg-slate-50 rounded-[3rem] border-4 border-slate-200 border-dashed flex flex-col items-center justify-center text-slate-400 group hover:border-navy transition-colors"
          >
            <div className="p-8 bg-white rounded-full shadow-xl mb-4 group-hover:scale-110 transition-transform">
              <Play fill="#0055FF" className="text-navy" size={40} />
            </div>
            <p className="font-black uppercase tracking-[0.2em] text-xs">
              Interactive Logic Gate Lab
            </p>
          </motion.div>

          <section className="space-y-6">
            <h3 className="text-3xl font-black text-slate-900">
              Step 1: The Inverter
            </h3>
            <p className="text-lg text-slate-600 leading-relaxed">
              To create a NOT gate from a NAND, you simply tie both inputs of
              the NAND together. Since both inputs will always be the same, the
              NAND's output becomes the perfect inverse of that input.
            </p>
          </section>

          <section
            ref={(el) => (sectionRefs.current[0] = el!)}
            className="space-y-6"
          >
            ...
          </section>
          {/* Integrated Assignment Section */}
          <AssignmentSection />
        </article>
      </main>

      {/* 3. AI Teacher Floating Bubble */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-10 right-10 w-16 h-16 bg-navy rounded-full shadow-2xl flex items-center justify-center text-white border-4 border-white z-50"
      >
        <Sparkles size={24} />
      </motion.button>

      {/* AI Chat Modal Overlay */}
      <AIChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <ReadingEngine contentRefs={sectionRefs} textSegments={lessonText} />
    </div>
  );
}

function SubtopicItem({
  title,
  status,
}: {
  title: string;
  status: "completed" | "current" | "locked" | "assignment";
}) {
  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-2xl transition-all cursor-pointer border-2
      ${status === "current" ? "bg-white border-navy shadow-sm" : "bg-transparent border-transparent hover:bg-slate-200/50"}
    `}
    >
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0
        ${
          status === "completed"
            ? "bg-power-teal text-white"
            : status === "current"
              ? "bg-navy text-white"
              : "bg-slate-200 text-slate-400"
        }
      `}
      >
        {status === "completed" ? (
          <CheckCircle2 size={16} />
        ) : (
          <div className="w-1.5 h-1.5 bg-current rounded-full" />
        )}
      </div>
      <span
        className={`text-sm font-bold ${status === "locked" ? "text-slate-400" : "text-slate-900"}`}
      >
        {title}
      </span>
    </div>
  );
}

function ControlButton({
  icon: Icon,
  label,
  color,
}: {
  icon: any;
  label: string;
  color: string;
}) {
  return (
    <div className="group relative flex items-center">
      <span className="absolute right-full mr-3 px-3 py-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {label}
      </span>
      <button
        className={`w-12 h-12 ${color} text-white rounded-2xl shadow-lg border-b-4 border-black/20 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center`}
      >
        <Icon size={20} />
      </button>
    </div>
  );
}
