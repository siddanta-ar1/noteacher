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

// New Statistical Thinking Simulations
const DataFog = lazy(() => import("@/components/simulations/DataFog"));
const ScopeSlider = lazy(() => import("@/components/simulations/ScopeSlider"));
const ReviewRoulette = lazy(() => import("@/components/simulations/ReviewRoulette"));
const CrowdEstimator = lazy(() => import("@/components/simulations/CrowdEstimator"));

const SIMULATION_REGISTRY: Record<string, React.LazyExoticComponent<any> | React.ComponentType<any>> = {
    // Registered components
    "logic-gates": Workbench,
    "statistics": StatisticsVisualizer,
    "web-dev": WebDevSimulator,

    // Statistical Thinking (Level 0)
    "DataFog": DataFog,
    "ScopeSlider": ScopeSlider,
    "ReviewRoulette": ReviewRoulette,
    "StreakBreaker": lazy(() => import("@/components/simulations/StreakBreaker")),

    // Topic 2
    "DiceBettingSim": lazy(() => import("@/components/simulations/DiceBettingSim")),
    "CrowdEstimator": CrowdEstimator,
    "MonkeyInvestor": lazy(() => import("@/components/simulations/MonkeyInvestor")),
    "LongRunGraph": lazy(() => import("@/components/simulations/LongRunGraph")),

    // Topic 3
    "DeterministicSystemSim": lazy(() => import("@/components/simulations/DeterministicSystemSim")),
    "StochasticGrowthSim": lazy(() => import("@/components/simulations/StochasticGrowthSim")),
    "EfficiencyTunerSim": lazy(() => import("@/components/simulations/EfficiencyTunerSim")),

    // Topic 4
    "HeadlineVsData": lazy(() => import("@/components/simulations/HeadlineVsData")),
    "AnchoringSim": lazy(() => import("@/components/simulations/AnchoringSim")),
    "IntuitionRun": lazy(() => import("@/components/simulations/IntuitionRun")),
    "PatternDetector": lazy(() => import("@/components/simulations/PatternDetector")),

    // Aliases & Future
    "network-visualizer": WebDevSimulator,
    "box-model": WebDevSimulator,
    "flexbox": WebDevSimulator,
    "selectors": WebDevSimulator,
    "devtools": WebDevSimulator,
    "dom": WebDevSimulator,

    "circuit": () => <ComingSoonPlaceholder type="Circuit Simulator" />,
    "number-line": () => <ComingSoonPlaceholder type="Number Line" />,

    // Wisdom of Crowds (Jar Guess)
    "the-jar-guess": CrowdEstimator,
    "jar-guess": CrowdEstimator,
    "wisdom-of-crowds": CrowdEstimator,

    "probability": StatisticsVisualizer,
    "histogram": StatisticsVisualizer,
    "central-tendency": StatisticsVisualizer,
    "z-score": StatisticsVisualizer,
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

    // Special styling for "Workbench" style simulations (dark mode, fixed height)
    // vs Content Simulations (light mode, auto height)
    const isWorkbench = ["logic-gates", "web-dev", "network-visualizer"].some(k => simulationId.includes(k));

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
            <div className={isWorkbench
                ? "h-[500px] w-full bg-slate-900 rounded-3xl overflow-hidden border-4 border-slate-100 shadow-xl relative"
                : "w-full" // Allow component to define its own dimensions
            }>
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
