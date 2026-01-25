"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Cpu, Globe, Zap, Code } from "lucide-react";
import { useRouter } from "next/navigation";
import { saveInterests } from "@/services";
import { INTERESTS, ROUTES } from "@/config";

const ICON_MAP = {
  Code,
  Zap,
  Cpu,
  Globe,
} as const;

export default function InterestPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (selected.length === 0) return;
    setLoading(true);
    await saveInterests(selected);
    router.push(ROUTES.HOME);
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Pick Your Path
          </h1>
          <p className="text-slate-400 text-lg">
            We'll tailor the curriculum to your goals.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-12">
          {INTERESTS.map((item) => {
            const isSelected = selected.includes(item.id);
            const Icon = ICON_MAP[item.icon as keyof typeof ICON_MAP];
            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggle(item.id)}
                className={`p-6 rounded-[2rem] border-4 transition-all flex flex-col items-center gap-4 relative
                  ${isSelected
                    ? "bg-power-teal border-power-teal text-white shadow-lg shadow-power-teal/20"
                    : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                  }
                `}
              >
                <Icon size={32} />
                <span className="font-bold">{item.label}</span>
                {isSelected && (
                  <div className="absolute top-4 right-4 bg-white text-power-teal rounded-full p-1">
                    <Check size={12} strokeWidth={4} />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        <button
          onClick={handleSubmit}
          disabled={selected.length === 0 || loading}
          className="w-full py-6 bg-white rounded-2xl font-black text-xl text-navy hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
        >
          {loading ? "Calibrating..." : "Start Learning"}
        </button>
      </div>
    </div>
  );
}
