"use client";

import { useState } from "react";
import Gate from "./Gate";
import {
  CircuitNode,
  Wire,
  simulateCircuit,
  GateType,
} from "@/lib/simulator/engine";
import { Trash2 } from "lucide-react";

export default function Workbench() {
  const [nodes, setNodes] = useState<CircuitNode[]>([]);
  const [wires, setWires] = useState<Wire[]>([]);
  const [wiringSource, setWiringSource] = useState<string | null>(null); // ID of gate starting the wire

  // --- ACTIONS ---

  const addNode = (type: GateType) => {
    const newNode: CircuitNode = {
      id: crypto.randomUUID(),
      type,
      x: 100 + Math.random() * 50,
      y: 100 + Math.random() * 50,
      inputs: [false, false],
      output: false,
    };
    setNodes((prev) => [...prev, newNode]);
  };

  const updateNodePosition = (id: string, x: number, y: number) => {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, x, y } : n)));
  };

  const toggleSwitch = (id: string) => {
    setNodes((prev) => {
      const updated = prev.map((n) =>
        n.id === id ? { ...n, output: !n.output } : n,
      );
      return simulateCircuit(updated, wires);
    });
  };

  // --- WIRING SYSTEM ---

  const startWire = (sourceId: string) => {
    setWiringSource(sourceId);
  };

  const completeWire = (targetId: string, inputIndex: number) => {
    if (wiringSource && wiringSource !== targetId) {
      // Create new wire
      const newWire: Wire = {
        id: crypto.randomUUID(),
        sourceId: wiringSource,
        targetId,
        targetInputIndex: inputIndex,
      };

      const newWires = [...wires, newWire];
      setWires(newWires);
      setWiringSource(null);

      // Update Simulation
      setNodes((prev) => simulateCircuit(prev, newWires));
    } else {
      setWiringSource(null);
    }
  };

  const clearCanvas = () => {
    setNodes([]);
    setWires([]);
  };

  // --- RENDERING WIRES (SVG) ---
  const renderWires = () => {
    return wires.map((wire) => {
      const source = nodes.find((n) => n.id === wire.sourceId);
      const target = nodes.find((n) => n.id === wire.targetId);
      if (!source || !target) return null;

      // Calculate Visual Ports (Approximate based on Gate dimensions 96x64)
      const x1 = source.x + 96; // Right side
      const y1 = source.y + 32; // Center Y

      const x2 = target.x - 12; // Left side
      // Calculate Y based on input index
      const inputOffset =
        target.type === "NOT" || target.type === "LED"
          ? 32
          : wire.targetInputIndex === 0
            ? 20
            : 44;
      const y2 = target.y + inputOffset;

      const strokeColor = source.output ? "#4ade80" : "#475569"; // Green if high, Grey if low

      return (
        <line
          key={wire.id}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={strokeColor}
          strokeWidth="4"
          strokeLinecap="round"
          className="transition-colors duration-300"
        />
      );
    });
  };

  return (
    <div className="flex-1 flex relative h-full">
      {/* 1. PALETTE (Left Sidebar) */}
      <div className="w-64 bg-slate-800/50 border-r border-white/5 p-4 flex flex-col gap-4 z-30">
        <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2">
          Components
        </p>
        <div className="grid grid-cols-2 gap-2">
          {["SWITCH", "LED", "AND", "OR", "NOT", "NAND", "XOR"].map((type) => (
            <button
              key={type}
              onClick={() => addNode(type as GateType)}
              className="bg-slate-700/50 p-3 rounded-xl border border-white/5 hover:border-power-teal/50 hover:bg-slate-700 transition-all text-xs font-bold text-white shadow-lg"
            >
              {type}
            </button>
          ))}
        </div>
        <button
          onClick={clearCanvas}
          className="mt-auto flex items-center justify-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm font-bold"
        >
          <Trash2 size={16} /> Clear Canvas
        </button>
      </div>

      {/* 2. CANVAS */}
      <div className="flex-1 bg-slate-900 relative overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 pointer-events-none" />

        {/* Hints */}
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
            <div className="text-center">
              <p className="text-4xl font-black text-white/10 mb-2">
                WORKBENCH
              </p>
              <p className="text-sm font-mono text-power-teal">
                Click components to add them
              </p>
            </div>
          </div>
        )}

        {wiringSource && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-power-teal text-slate-900 px-4 py-1 rounded-full text-xs font-black animate-pulse z-40">
            Select Input Port to Connect
          </div>
        )}

        {/* SVG Layer for Wires */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {renderWires()}
        </svg>

        {/* Nodes Layer */}
        {nodes.map((node) => (
          <Gate
            key={node.id}
            {...node}
            onDragEnd={updateNodePosition}
            onToggle={toggleSwitch}
            onWireStart={startWire}
            onWireEnd={completeWire}
          />
        ))}
      </div>
    </div>
  );
}
