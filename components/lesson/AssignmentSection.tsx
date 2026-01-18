"use client";

import { motion } from "framer-motion";
import {
  Layout,
  Cpu,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

type AssignmentSectionProps = {
  title: string;
  task: string;
  isCompleted?: boolean;
};

export default function AssignmentSection({
  title,
  task,
  isCompleted = false,
}: AssignmentSectionProps) {
  return (
    <motion.div
      id="simulator-section" // ID for auto-scroll targeting
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className="relative group"
    >
      {/* Decorative 'Connection' Lines */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-px h-12 bg-gradient-to-b from-transparent to-navy/20" />
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full border-4 border-white bg-navy z-10" />

      {/* Main Card */}
      <div className="bg-navy rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden shadow-2xl shadow-navy/25 ring-4 ring-white">
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-power-teal/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-white/10 pb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 text-power-teal">
                <Cpu size={28} />
              </div>
              <div>
                <h3 className="text-white font-black text-2xl tracking-tight">
                  Lab Mission
                </h3>
                <p className="text-slate-400 font-medium text-sm uppercase tracking-widest">
                  Interactive Sandbox
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div
              className={`
              px-5 py-2 rounded-full border flex items-center gap-2 font-bold text-sm
              ${
                isCompleted
                  ? "bg-power-teal/20 border-power-teal text-power-teal"
                  : "bg-orange-500/10 border-orange-500/30 text-orange-400"
              }
            `}
            >
              {isCompleted ? (
                <CheckCircle2 size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              {isCompleted ? "MISSION ACCOMPLISHED" : "PENDING EXECUTION"}
            </div>
          </div>

          {/* Task Content */}
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-3 space-y-4">
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-power-teal" />
                Objective
              </h4>
              <p className="text-slate-300 leading-relaxed text-lg">
                {task || "Access the simulator to build the required circuit."}
              </p>

              <div className="pt-4">
                <div className="inline-flex items-center gap-2 text-xs font-mono text-slate-500 bg-black/20 px-3 py-1 rounded-md border border-white/5">
                  <span>
                    ID: {Buffer.from(title).toString("base64").substring(0, 8)}
                  </span>
                  <span>|</span>
                  <span>REV: 1.0</span>
                </div>
              </div>
            </div>

            {/* Action Area */}
            <div className="md:col-span-2 flex flex-col justify-center">
              <Link
                href={`/simulator?task=${encodeURIComponent(title)}`}
                className="w-full"
              >
                <button className="w-full py-5 bg-white hover:bg-power-teal text-navy hover:text-white rounded-2xl font-black text-lg transition-all shadow-[0_0_0_4px_rgba(255,255,255,0.1)] hover:shadow-[0_0_0_8px_rgba(45,212,191,0.2)] flex items-center justify-center gap-3 group/btn">
                  <Layout size={20} />
                  Launch Simulator
                  <ArrowRight
                    size={20}
                    className="group-hover/btn:translate-x-1 transition-transform"
                  />
                </button>
              </Link>
              <p className="text-center text-slate-500 text-xs mt-4 font-medium">
                Opens in a dedicated workspace
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
