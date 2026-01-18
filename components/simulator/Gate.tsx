"use client";

import { motion } from "framer-motion";
import { GateType } from "@/lib/simulator/engine";
import { Power, Lightbulb } from "lucide-react";

type GateProps = {
  id: string;
  type: GateType;
  x: number;
  y: number;
  output: boolean;
  onDragEnd: (id: string, x: number, y: number) => void;
  onToggle?: (id: string) => void; // For Switches
  onWireStart: (id: string) => void;
  onWireEnd: (id: string, inputIndex: number) => void;
};

const GATE_COLORS: Record<string, string> = {
  AND: "bg-blue-600",
  OR: "bg-purple-600",
  NOT: "bg-red-600",
  NAND: "bg-orange-600",
  XOR: "bg-pink-600",
  SWITCH: "bg-slate-700",
  LED: "bg-slate-800",
};

export default function Gate({
  id,
  type,
  x,
  y,
  output,
  onDragEnd,
  onToggle,
  onWireStart,
  onWireEnd,
}: GateProps) {
  const isSwitch = type === "SWITCH";
  const isLED = type === "LED";

  return (
    <motion.div
      drag
      dragMomentum={false}
      onDragEnd={(_, info) =>
        onDragEnd(id, x + info.offset.x, y + info.offset.y)
      }
      initial={{ x, y }}
      className={`absolute flex flex-col items-center justify-center w-24 h-16 rounded-xl shadow-xl border-2 border-white/20 backdrop-blur-md cursor-grab active:cursor-grabbing z-20 ${GATE_COLORS[type] || "bg-slate-600"}`}
    >
      {/* Title */}
      <span className="text-white font-black text-xs uppercase tracking-wider mb-1 pointer-events-none select-none">
        {type}
      </span>

      {/* Specific UI: Switch Toggle or LED Light */}
      {isSwitch && (
        <button
          onClick={() => onToggle?.(id)}
          onPointerDown={(e) => e.stopPropagation()}
          className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${output ? "bg-power-green border-white" : "bg-slate-900 border-white/30"}`}
        >
          <Power size={14} className="text-white" />
        </button>
      )}

      {isLED && (
        <div
          className={`w-6 h-6 rounded-full shadow-inner border transition-all duration-300 ${output ? "bg-red-500 shadow-[0_0_20px_#ef4444] border-red-300" : "bg-red-900/30 border-red-900"}`}
        >
          <Lightbulb
            size={12}
            className={`mx-auto mt-1 ${output ? "text-white" : "text-white/20"}`}
          />
        </div>
      )}

      {/* INPUT PORTS (Left Side) */}
      {!isSwitch && (
        <div className="absolute -left-3 top-0 bottom-0 flex flex-col justify-center gap-4">
          {[0, 1]
            .slice(0, type === "NOT" || type === "LED" ? 1 : 2)
            .map((idx) => (
              <div
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  onWireEnd(id, idx);
                }}
                className="w-4 h-4 bg-white rounded-full border-2 border-slate-900 cursor-crosshair hover:scale-125 transition-transform"
              />
            ))}
        </div>
      )}

      {/* OUTPUT PORT (Right Side) */}
      {!isLED && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onWireStart(id);
          }}
          className={`absolute -right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-slate-900 cursor-crosshair hover:scale-125 transition-transform ${output ? "bg-power-green shadow-[0_0_10px_#4ade80]" : "bg-slate-400"}`}
        />
      )}
    </motion.div>
  );
}
