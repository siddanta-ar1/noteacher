"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Cpu,
  Code2,
  Zap,
  Wifi,
  LogOut,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { saveInterests, signOut } from "./actions";

const DOMAINS = [
  {
    id: "Computer Science",
    icon: Code2,
    label: "Computer Science",
    desc: "Software, Algorithms, & OS",
    color: "bg-power-purple",
  },
  {
    id: "Electrical Engineering",
    icon: Zap,
    label: "Electrical Eng.",
    desc: "Circuits, Signals, & Power",
    color: "bg-power-orange",
  },
  {
    id: "Electronics",
    icon: Cpu,
    label: "Electronics (ECE)",
    desc: "Microprocessors & Embedded",
    color: "bg-power-teal",
  },
  {
    id: "Robotics",
    icon: Wifi,
    label: "Robotics & IoT",
    desc: "Sensors, Actuators, & Control",
    color: "bg-navy",
  },
];

export default function InterestPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSelection = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else {
      setSelected([...selected, id]); // Allow multiple or limit to 1
    }
  };

  const handleContinue = async () => {
    if (selected.length === 0) return;
    setIsSubmitting(true);
    try {
      await saveInterests(selected);
    } catch (error) {
      alert("Failed to save. Try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* ESCAPE HATCH (Fixes your loop bug) */}
      <button
        onClick={() => signOut()}
        className="absolute top-8 right-8 text-slate-400 hover:text-navy flex items-center gap-2 font-bold text-sm transition-colors z-20"
      >
        <LogOut size={16} /> Sign Out
      </button>

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-power-purple via-power-teal to-power-orange" />
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-power-purple/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-power-teal/5 rounded-full blur-3xl" />

      <div className="max-w-2xl w-full relative z-10">
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mx-auto mb-6"
          >
            <Cpu className="text-navy w-8 h-8" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-black text-slate-900 mb-3"
          >
            Identify Your Signal.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 font-medium"
          >
            NOTEacher adapts the curriculum to your major. <br />
            Select your primary field of study.
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {DOMAINS.map((domain, index) => {
            const isSelected = selected.includes(domain.id);
            const Icon = domain.icon;

            return (
              <motion.button
                key={domain.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => toggleSelection(domain.id)}
                className={`
                  relative p-6 rounded-2xl text-left border-2 transition-all group
                  ${
                    isSelected
                      ? "bg-white border-navy shadow-xl scale-[1.02]"
                      : "bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50"
                  }
                `}
              >
                <div
                  className={`
                  w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors
                  ${isSelected ? domain.color + " text-white" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"}
                `}
                >
                  <Icon size={20} />
                </div>

                <h3
                  className={`font-black text-lg mb-1 ${isSelected ? "text-slate-900" : "text-slate-700"}`}
                >
                  {domain.label}
                </h3>
                <p className="text-xs font-bold text-slate-400">
                  {domain.desc}
                </p>

                {isSelected && (
                  <div className="absolute top-4 right-4 text-power-teal">
                    <CheckCircle2
                      size={24}
                      className="fill-current text-white"
                    />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        <div className="text-center">
          <button
            onClick={handleContinue}
            disabled={selected.length === 0 || isSubmitting}
            className={`
              px-10 py-4 rounded-xl font-black text-lg flex items-center gap-3 mx-auto transition-all
              ${
                selected.length > 0
                  ? "bg-navy text-white shadow-xl hover:scale-105 active:scale-95"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }
            `}
          >
            {isSubmitting ? "Calibrating..." : "Initialize Profile"}
            {!isSubmitting && <ArrowRight size={20} />}
          </button>

          <p className="mt-6 text-xs font-bold text-slate-300 uppercase tracking-widest">
            Step 1 of 4: Calibration
          </p>
        </div>
      </div>
    </div>
  );
}
