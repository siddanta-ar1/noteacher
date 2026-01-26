"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Server, Smartphone, Monitor } from "lucide-react";

type WebDevSimProps = {
    mode: "network" | "box-model" | "flexbox" | "dom" | "selectors" | "devtools";
    config?: Record<string, unknown>;
};

export default function WebDevSimulator({ mode, config }: WebDevSimProps) {
    // --- MODE 1: NETWORK REQUEST CYCLE ---
    if (mode === "network") {
        const [step, setStep] = useState(0); // 0: Idle, 1: Request, 2: Server Processing, 3: Response

        const startRequest = () => {
            if (step !== 0) return;
            setStep(1);
            setTimeout(() => setStep(2), 1500); // Server reached
            setTimeout(() => setStep(3), 3000); // Response sent
            setTimeout(() => setStep(0), 4500); // Reset
        };

        return (
            <div className="w-full h-96 bg-slate-900 rounded-3xl flex flex-col items-center justify-center p-6 border-4 border-slate-800 relative overflow-hidden">
                <div className="flex items-center justify-between w-full max-w-2xl px-12 relative z-10">
                    {/* Client */}
                    <div className="flex flex-col items-center gap-4">
                        <div className={`p-4 rounded-2xl bg-slate-800 border-2 ${step === 0 || step === 3 ? "border-power-teal" : "border-slate-600"}`}>
                            <Monitor size={48} className={step === 0 || step === 3 ? "text-power-teal" : "text-slate-400"} />
                        </div>
                        <span className="text-white font-bold">Client (Browser)</span>
                    </div>

                    {/* Server */}
                    <div className="flex flex-col items-center gap-4">
                        <div className={`p-4 rounded-2xl bg-slate-800 border-2 ${step === 2 ? "border-power-orange" : "border-slate-600"}`}>
                            <Server size={48} className={step === 2 ? "text-power-orange" : "text-slate-400"} />
                        </div>
                        <span className="text-white font-bold">Server</span>
                    </div>
                </div>

                {/* Packet Animation */}
                <AnimatePresence>
                    {step === 1 && (
                        <motion.div
                            initial={{ left: "20%", opacity: 0 }}
                            animate={{ left: "80%", opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                            className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
                        >
                            <div className="w-4 h-4 rounded-full bg-power-teal shadow-[0_0_10px_#2dd4bf]" />
                            <span className="text-[10px] text-power-teal font-mono mt-2">GET /index.html</span>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            initial={{ left: "80%", opacity: 0 }}
                            animate={{ left: "20%", opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                            className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
                        >
                            <div className="w-4 h-4 rounded-full bg-power-orange shadow-[0_0_10px_#f97316]" />
                            <span className="text-[10px] text-power-orange font-mono mt-2">200 OK (HTML)</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    onClick={startRequest}
                    disabled={step !== 0}
                    className="mt-12 px-8 py-3 bg-white text-navy rounded-xl font-black hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                >
                    {step === 0 ? "SEND REQUEST" : "PROCESSING..."}
                </button>
            </div>
        );
    }

    // --- MODE 2: BOX MODEL ---
    if (mode === "box-model") {
        const [padding, setPadding] = useState(20);
        const [margin, setMargin] = useState(20);
        const [border, setBorder] = useState(5);

        return (
            <div className="w-full h-96 bg-slate-900 rounded-3xl flex items-center gap-8 p-6 border-4 border-slate-800">
                {/* Controls */}
                <div className="w-48 flex flex-col gap-6 text-white">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-power-orange">Margin: {margin}px</label>
                        <input
                            type="range"
                            min="0"
                            max="50"
                            value={margin}
                            onChange={(e) => setMargin(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-power-orange"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-yellow-400">Border: {border}px</label>
                        <input
                            type="range"
                            min="0"
                            max="20"
                            value={border}
                            onChange={(e) => setBorder(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-power-teal">Padding: {padding}px</label>
                        <input
                            type="range"
                            min="0"
                            max="50"
                            value={padding}
                            onChange={(e) => setPadding(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-power-teal"
                        />
                    </div>
                </div>

                {/* Visualization */}
                <div className="flex-1 flex items-center justify-center bg-white/5 rounded-2xl h-full relative">
                    <div
                        className="flex items-center justify-center relative transition-all duration-300 ease-out"
                        style={{
                            margin: `${margin}px`,
                            border: `${border}px solid #facc15`, // Yellow border
                            padding: `${padding}px`,
                            backgroundColor: "rgba(249, 115, 22, 0.2)", // Orange margin (conceptually outside, but represented here)
                        }}
                    >
                        {/* Margin Label (Pseudo-visual) */}
                        <div className="absolute -top-6 left-0 text-[10px] text-power-orange font-mono">MARGIN</div>

                        {/* The Border Box */}
                        <div className="bg-slate-800/50 absolute inset-0 -z-10" />

                        {/* The Content Box */}
                        <div className="w-32 h-20 bg-power-blue flex items-center justify-center text-white font-bold rounded-sm relative z-10 shadow-lg">
                            CONTENT
                            <div className="absolute -bottom-6 text-[10px] text-power-teal font-mono">PADDING</div>
                        </div>

                        {/* Padding Visualizer Layer (Greenish) */}
                        <div
                            className="absolute inset-0 bg-power-teal/20 -z-0 pointer-events-none"
                            style={{ margin: `-${padding}px` }} // Trick since we are inside padding
                        />
                    </div>
                </div>
            </div>
        );
    }

    // --- MODE 3: FLEXBOX FROGGY LITE ---
    if (mode === "flexbox") {
        const [justify, setJustify] = useState<"flex-start" | "center" | "flex-end" | "space-between">("flex-start");
        const [align, setAlign] = useState<"flex-start" | "center" | "flex-end">("center");

        return (
            <div className="w-full h-96 bg-slate-900 rounded-3xl flex flex-col p-6 border-4 border-slate-800 gap-4">
                {/* Controls */}
                <div className="flex gap-4 p-4 bg-slate-800 rounded-xl">
                    <div className="flex-1 space-y-2">
                        <label className="text-xs font-bold text-slate-400">justify-content</label>
                        <div className="flex gap-2">
                            {["flex-start", "center", "flex-end", "space-between"].map((v) => (
                                <button
                                    key={v}
                                    onClick={() => setJustify(v as "flex-start" | "center" | "flex-end" | "space-between")}
                                    className={`px-3 py-1 rounded text-[10px] font-bold font-mono transition-colors ${justify === v ? "bg-power-teal text-navy" : "bg-slate-700 text-white"
                                        }`}
                                >
                                    {v}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 space-y-2">
                        <label className="text-xs font-bold text-slate-400">align-items</label>
                        <div className="flex gap-2">
                            {["flex-start", "center", "flex-end"].map((v) => (
                                <button
                                    key={v}
                                    onClick={() => setAlign(v as "flex-start" | "center" | "flex-end")}
                                    className={`px-3 py-1 rounded text-[10px] font-bold font-mono transition-colors ${align === v ? "bg-power-purple text-white" : "bg-slate-700 text-white"
                                        }`}
                                >
                                    {v}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Container */}
                <div
                    className="flex-1 bg-slate-800 rounded-xl border-2 border-dashed border-slate-600 relative overflow-hidden flex transition-all duration-500"
                    style={{ justifyContent: justify, alignItems: align }}
                >
                    {/* Frogs */}
                    {[1, 2, 3].map((i) => (
                        <motion.div
                            layout
                            key={i}
                            className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-2xl shadow-lg border-4 border-white transform hover:scale-110 cursor-pointer"
                        >
                            🐸
                        </motion.div>
                    ))}
                </div>
            </div>
        );
    }

    // --- MODE 4: SELECTORS GAME ---
    if (mode === "selectors") {
        const [selection, setSelection] = useState("");
        const [solved, setSolved] = useState(false);

        const check = () => {
            if (selection === ".red" || selection === "circle.red") {
                setSolved(true);
            } else {
                setSelection(""); // shake effect in real app
            }
        };

        return (
            <div className="w-full h-96 bg-slate-900 rounded-3xl flex flex-col p-6 border-4 border-slate-800 items-center justify-center gap-6">
                <div className="flex gap-4 p-8 bg-white rounded-xl">
                    <div className="w-12 h-12 bg-blue-500 rounded-full border-4 border-slate-900" />
                    <div className="w-12 h-12 bg-red-500 rounded-full border-4 border-slate-900 animate-bounce" />
                    <div className="w-12 h-12 bg-blue-500 rounded-full border-4 border-slate-900" />
                </div>

                <div className="flex gap-2 w-full max-w-sm">
                    <input
                        type="text"
                        placeholder="Enter CSS selection for the red ball..."
                        className="flex-1 bg-slate-800 border-none rounded-lg px-4 py-2 text-white font-mono"
                        value={selection}
                        onChange={(e) => setSelection(e.target.value)}
                    />
                    <button onClick={check} className="bg-power-teal text-navy font-bold px-4 rounded-lg">Check</button>
                </div>

                {solved && <div className="text-green-400 font-bold">Try `.red` or `circle.red`! Correct!</div>}
                {!solved && <div className="text-slate-500 text-sm">Target the bouncing ball with a class selector.</div>}
            </div>
        );
    }

    // --- MODE 5: DOM TREE VISUALIZER ---
    if (mode === "dom") {
        return (
            <div className="w-full h-96 bg-slate-900 rounded-3xl flex flex-col p-6 border-4 border-slate-800 gap-6 overflow-hidden">
                <div className="flex-1 flex gap-4">
                    {/* Tree View */}
                    <div className="w-1/2 bg-slate-800 rounded-xl p-4 overflow-y-auto font-mono text-sm">
                        <div className="text-purple-400">html</div>
                        <div className="pl-4 border-l border-slate-700">
                            <div className="text-purple-400">head</div>
                            <div className="text-purple-400">body</div>
                            <div className="pl-4 border-l border-slate-700">
                                <div className="text-blue-400 hover:bg-slate-700 cursor-pointer rounded px-1 transition-colors">div.container</div>
                                <div className="pl-4 border-l border-slate-700">
                                    <div className="text-green-400 hover:bg-slate-700 cursor-pointer rounded px-1 transition-colors">h1 ("Hello")</div>
                                    <div className="text-green-400 hover:bg-slate-700 cursor-pointer rounded px-1 transition-colors">p ("World")</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="w-1/2 bg-white rounded-xl p-4 flex flex-col items-center justify-center gap-2 border-2 border-slate-600">
                        <div className="w-full h-full border-2 border-dashed border-blue-400 p-4 rounded bg-blue-50 relative group">
                            <span className="absolute top-0 right-0 bg-blue-400 text-white text-[10px] px-1">div</span>
                            <h1 className="text-2xl font-bold border-2 border-dashed border-green-500 p-2 hover:bg-green-100 transition-colors relative">
                                Hello
                                <span className="absolute top-0 right-0 bg-green-500 text-white text-[10px] px-1 opacity-0 group-hover:opacity-100">h1</span>
                            </h1>
                            <p className="text-slate-600 border-2 border-dashed border-green-500 p-2 hover:bg-green-100 transition-colors relative mt-2">
                                World
                                <span className="absolute top-0 right-0 bg-green-500 text-white text-[10px] px-1 opacity-0 group-hover:opacity-100">p</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="text-center text-slate-400 text-xs">Hover over elements to see the DOM mapping</div>
            </div>
        );
    }

    // --- MODE 6: DEVTOOLS INSPECTOR ---
    if (mode === "devtools") {
        const [inspecting, setInspecting] = useState(false);
        const [target, setTarget] = useState<string | null>(null);

        return (
            <div className="w-full h-96 bg-slate-900 rounded-3xl flex flex-col border-4 border-slate-800 overflow-hidden">
                {/* Browser Toolbar */}
                <div className="h-10 bg-slate-800 flex items-center px-4 gap-2 border-b border-slate-700">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="flex-1 bg-slate-900 h-6 rounded px-2 text-xs text-slate-400 flex items-center">
                        localhost:3000
                    </div>
                </div>

                <div className="flex-1 flex flex-col relative">
                    {/* Web Content */}
                    <div className="flex-1 bg-white p-8 flex flex-col gap-4 items-start justify-center relative"
                        onMouseLeave={() => inspecting && setTarget(null)}>

                        <h1
                            className={`text-4xl font-black text-navy border-2 ${inspecting && target === 'h1' ? 'border-blue-500 bg-blue-100' : 'border-transparent'}`}
                            onMouseEnter={() => inspecting && setTarget('h1')}
                        >
                            Inspect Me!
                            {inspecting && target === 'h1' && <span className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-1">h1.font-black</span>}
                        </h1>

                        <button
                            className={`px-6 py-3 bg-power-teal text-navy font-bold rounded-lg border-2 ${inspecting && target === 'button' ? 'border-blue-500 bg-teal-200' : 'border-transparent'}`}
                            onMouseEnter={() => inspecting && setTarget('button')}
                        >
                            Click Button
                            {inspecting && target === 'button' && <span className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-1">button.btn</span>}
                        </button>
                    </div>

                    {/* DevTools Drawer */}
                    <div className="h-40 bg-slate-900 border-t border-slate-700 flex flex-col">
                        <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-white/5">
                            <div className="text-xs font-bold text-slate-400 flex gap-4">
                                <span className="text-white border-b-2 border-power-teal">Elements</span>
                                <span>Console</span>
                                <span>Network</span>
                            </div>
                            <button
                                onClick={() => setInspecting(!inspecting)}
                                className={`p-1.5 rounded transition-colors ${inspecting ? 'bg-blue-500 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6" /><path d="m12 12 4 10 1.7-4.3L22 16Z" /></svg>
                            </button>
                        </div>
                        <div className="p-4 font-mono text-xs text-slate-300 overflow-y-auto">
                            {target === 'h1' ? (
                                <div className="animate-pulse bg-slate-800 p-2 rounded">
                                    <span className="text-blue-400">&lt;h1</span> <span className="text-yellow-400">class</span>=<span className="text-green-400">"text-4xl..."</span>&gt;
                                    Inspect Me!
                                    <span className="text-blue-400">&lt;/h1&gt;</span>
                                </div>
                            ) : target === 'button' ? (
                                <div className="animate-pulse bg-slate-800 p-2 rounded">
                                    <span className="text-blue-400">&lt;button</span> <span className="text-yellow-400">class</span>=<span className="text-green-400">"px-6..."</span>&gt;
                                    Click Button
                                    <span className="text-blue-400">&lt;/button&gt;</span>
                                </div>
                            ) : (
                                <div className="text-slate-500 italic">Select an element to inspect its source code...</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return <div className="text-white">WebDev Visualizer Mode Not Found</div>;
}
