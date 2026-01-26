"use client";

import { Suspense, lazy } from "react";
import { Loader2, Play, Info } from "lucide-react";
import type { SimulationBlock } from "@/types/content";

// Lazy load simulators to reduce initial bundle size
const Workbench = lazy(() => import("@/components/simulator/Workbench"));
const StatisticsVisualizer = lazy(
    () => import("@/components/lesson/visualizers/StatisticsVisualizer")
);
const WebDevSimulator = lazy(
    () => import("@/components/lesson/visualizers/WebDevSimulator")
);

const SIMULATION_REGISTRY: Record<string, React.LazyExoticComponent<any> | React.ComponentType<any>> = {
    // Registered components
    "logic-gates": Workbench,
    "statistics": StatisticsVisualizer,
    "web-dev": WebDevSimulator, // Generic entry
    "network-visualizer": WebDevSimulator, // Specific aliases
    "box-model": WebDevSimulator,
    "flexbox": WebDevSimulator,
    "selectors": WebDevSimulator,

    "circuit": () => <ComingSoonPlaceholder type="Circuit Simulator" />,
    "number-line": () => <ComingSoonPlaceholder type="Number Line" />,
    "probability": StatisticsVisualizer, // Mapped to Stats visualizer which has 'gambler' mode
};

interface SimulationBlockProps {
    block: SimulationBlock;
}

/**
 * SimulationBlock - Interactive simulation container with lazy loading
 */
export default function SimulationBlockComponent({
    block,
}: SimulationBlockProps) {
    const { simulationId, instructions, config } = block;

    // Dynamic Registry Lookup
    const SimulationComponent = SIMULATION_REGISTRY[simulationId];

    if (!SimulationComponent) {
        return <ComingSoonPlaceholder type={simulationId} />;
    }

    return (
        <div className="space-y-4">
            {/* Instructions */}
            {instructions && (
                <div className="flex items-start gap-3 p-4 bg-navy/5 rounded-2xl border border-navy/10">
                    <Info className="w-5 h-5 text-navy shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-600">
                        {instructions}
                    </p>
                </div>
            )}

            {/* Simulation container */}
            <div className="h-[500px] w-full bg-slate-900 rounded-3xl overflow-hidden border-4 border-slate-100 shadow-xl relative">
                <Suspense fallback={<LoadingFallback />}>
                    <SimulationComponent {...(config || {})} />
                </Suspense>
            </div>
        </div>
    );
}



/**
 * Loading fallback for lazy-loaded simulators
 */
function LoadingFallback() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-white gap-4">
            <div className="relative">
                <div className="absolute inset-0 bg-power-teal/30 rounded-full blur-xl animate-pulse" />
                <Loader2 className="w-12 h-12 text-power-teal animate-spin relative z-10" />
            </div>
            <p className="font-bold uppercase tracking-widest text-sm text-slate-400">
                Loading Simulation...
            </p>
        </div>
    );
}

/**
 * Placeholder for simulations not yet implemented
 */
function ComingSoonPlaceholder({ type }: { type: string }) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-white gap-6">
            <div className="w-24 h-24 bg-slate-800 rounded-3xl flex items-center justify-center border-2 border-dashed border-slate-600">
                <Play className="w-10 h-10 text-slate-500" />
            </div>
            <div className="text-center">
                <p className="font-black text-xl mb-2">{type}</p>
                <p className="text-slate-400 text-sm">
                    This simulation will be available soon
                </p>
            </div>
            <div className="flex items-center gap-2 text-power-teal text-xs font-bold uppercase tracking-widest">
                <div className="w-2 h-2 rounded-full bg-power-teal animate-pulse" />
                Blueprint Ready
            </div>
        </div>
    );
}
