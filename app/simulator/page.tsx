"use client";

import { Suspense } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import Workbench from "@/components/simulator/Workbench";

function SimulatorContent() {
  return (
    <div className="h-screen bg-slate-900 flex flex-col text-white overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <Link
            href="/home"
            className="text-white/50 hover:text-white transition-colors"
          >
            <ChevronLeft />
          </Link>
          <div className="h-6 w-px bg-white/10" />
          <h1 className="font-bold tracking-wide">
            SIMULATOR <span className="text-power-teal mx-2">//</span> ENGINE V1
          </h1>
        </div>
      </header>

      {/* The Actual Engine */}
      <Workbench />
    </div>
  );
}

export default function SimulatorPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen bg-slate-900 text-white flex items-center justify-center">
          Loading Engine...
        </div>
      }
    >
      <SimulatorContent />
    </Suspense>
  );
}
