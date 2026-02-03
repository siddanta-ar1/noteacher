"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dices, TrendingDown, RefreshCw } from "lucide-react";
import { cn } from "@/utils/cn";

/**
 * DiceBettingSim - Demonstrates the "House Edge" and Gambler's Fallacy
 * User bets on Over/Under 7. Even when they win occasionally, the long term trend is down.
 */
export default function DiceBettingSim() {
    const [balance, setBalance] = useState(1000);
    const [betAmount] = useState(50);
    const [history, setHistory] = useState<number[]>([]);
    const [lastRoll, setLastRoll] = useState<{ d1: number; d2: number } | null>(null);
    const [isRolling, setIsRolling] = useState(false);
    const [round, setRound] = useState(0);
    const [message, setMessage] = useState("Place your bet!");

    // Balance history for graph
    const [balanceHistory, setBalanceHistory] = useState<number[]>([1000]);

    const rollDice = async (betType: "over" | "under" | "equal") => {
        if (isRolling || balance < betAmount) return;

        setIsRolling(true);
        setMessage("Rolling...");

        // Simulate roll animation time
        await new Promise(r => setTimeout(r, 600));

        const d1 = Math.floor(Math.random() * 6) + 1;
        const d2 = Math.floor(Math.random() * 6) + 1;
        const sum = d1 + d2;

        setLastRoll({ d1, d2 });
        setHistory(prev => [sum, ...prev].slice(0, 5)); // Keep last 5

        // Determine Win/Loss
        let won = false;
        let payout = 0;

        if (betType === "over" && sum > 7) {
            won = true;
            payout = betAmount * 2; // 2:1 payout (House edge: Probability is 15/36 = 41.6%, need >2.4x to break even)
        } else if (betType === "under" && sum < 7) {
            won = true;
            payout = betAmount * 2;
        } else if (betType === "equal" && sum === 7) {
            won = true;
            payout = betAmount * 4; // 4:1 payout (Probability 6/36 = 16.6%, need 6x to break even)
        }

        const newBalance = balance - betAmount + (won ? payout : 0);
        setBalance(newBalance);
        setBalanceHistory(prev => [...prev, newBalance]);
        setRound(r => r + 1);

        if (won) {
            setMessage(`You Won $${payout - betAmount}!`);
        } else {
            setMessage("You Lost $50.");
        }

        setIsRolling(false);
    };

    const resetGame = () => {
        setBalance(1000);
        setBalanceHistory([1000]);
        setRound(0);
        setLastRoll(null);
        setHistory([]);
        setMessage("Place your bet!");
    };

    // Calculate normalized path for SVG graph
    const maxBalance = Math.max(...balanceHistory, 1200);
    const minBalance = 0;
    const range = maxBalance - minBalance;

    const getPoints = () => {
        if (balanceHistory.length < 2) return "";
        const width = 100; // SVG viewBox percentage
        const step = width / (balanceHistory.length - 1);

        return balanceHistory.map((b, i) => {
            const x = i * step;
            const y = 100 - ((b - minBalance) / range) * 100;
            return `${x},${y}`;
        }).join(" ");
    };

    return (
        <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-lg my-8">
            {/* Header */}
            <div className="bg-slate-50 border-b border-border p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <Dices size={18} />
                    </div>
                    <span className="font-bold text-ink-900 text-sm uppercase tracking-wider">
                        The Dice Trap
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <div className="text-xs font-bold text-ink-400">Balance</div>
                        <div className={cn("text-lg font-black font-mono", balance < 500 ? "text-red-500" : "text-emerald-600")}>
                            ${balance}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Area */}
            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">

                {/* Left: Game Controls */}
                <div className="flex-1 flex flex-col items-center">
                    {/* Dice Visual */}
                    <div className="h-32 flex items-center gap-4 mb-6">
                        <AnimatePresence mode="wait">
                            {lastRoll ? (
                                <>
                                    <DiceFace value={lastRoll.d1} />
                                    <DiceFace value={lastRoll.d2} />
                                </>
                            ) : (
                                <div className="text-slate-300 font-bold text-sm">Roll to start</div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="text-center mb-6 h-8 font-bold text-ink-600">
                        {message}
                    </div>

                    {/* Betting Controls */}
                    <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
                        <BetButton
                            label="Under 7"
                            sub="Pays 2:1"
                            onClick={() => rollDice("under")}
                            disabled={isRolling || balance < 50}
                        />
                        <BetButton
                            label="Equal 7"
                            sub="Pays 4:1"
                            onClick={() => rollDice("equal")}
                            disabled={isRolling || balance < 50}
                            highlight
                        />
                        <BetButton
                            label="Over 7"
                            sub="Pays 2:1"
                            onClick={() => rollDice("over")}
                            disabled={isRolling || balance < 50}
                        />
                    </div>

                    {balance < 50 && (
                        <div className="mt-6 text-center animate-bounce">
                            <p className="text-red-500 font-black mb-2">You went bust!</p>
                            <button
                                onClick={resetGame}
                                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold flex items-center gap-2 mx-auto hover:bg-slate-700"
                            >
                                <RefreshCw size={14} /> Try Again
                            </button>
                        </div>
                    )}
                </div>

                {/* Right: The Trap (Graph) */}
                <div className="flex-1 bg-slate-50 rounded-2xl border border-border p-4 relative overflow-hidden">
                    <h4 className="text-xs font-bold uppercase text-ink-400 mb-4 flex items-center gap-2">
                        <TrendingDown size={14} />
                        Your Wealth Trend
                    </h4>

                    {/* Graph Container */}
                    <div className="h-40 w-full relative">
                        {balanceHistory.length > 1 ? (
                            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                                {/* Grid lines */}
                                <line x1="0" y1="50" x2="100" y2="50" stroke="#CBD5E1" strokeWidth="0.5" strokeDasharray="2" />

                                {/* Path */}
                                <motion.path
                                    d={`M 0,${100 - ((1000 - minBalance) / range) * 100} L ${getPoints()}`}
                                    fill="none"
                                    stroke={balance < 1000 ? "#EF4444" : "#10B981"}
                                    strokeWidth="2"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </svg>
                        ) : (
                            <div className="h-full flex items-center justify-center text-xs text-slate-300 font-bold">
                                Graph will appear after playing
                            </div>
                        )}
                    </div>

                    <div className="mt-2 text-[10px] text-ink-400 text-center">
                        Rounds Played: {round}
                    </div>

                    {round > 5 && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur p-3 rounded-xl border border-red-100 shadow-sm text-center opacity-0 hover:opacity-100 transition-opacity">
                            <p className="text-xs font-bold text-red-500">The House Edge</p>
                            <p className="text-[10px] text-ink-500 w-32">Even if you win short term, the payouts are mathematically rigged to drain you.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function DiceFace({ value }: { value: number }) {
    const dots = {
        1: ["justify-center items-center"],
        2: ["justify-between"], // Top-left, bottom-right
        3: ["justify-between"], // Diagonal 3
        4: ["justify-between"], // Corners
        5: ["justify-between"], // Corners + center
        6: ["justify-between"], // 2 cols of 3
    };

    return (
        <motion.div
            initial={{ rotate: 180, scale: 0.5 }}
            animate={{ rotate: 0, scale: 1 }}
            className="w-16 h-16 bg-white rounded-xl border-2 border-indigo-100 shadow-lg flex p-3 gap-1"
        >
            {/* Custom dice rendering logic would go here, simplified for brevity */}
            <div className="w-full h-full flex items-center justify-center font-black text-2xl text-indigo-900">
                {value}
            </div>
        </motion.div>
    );
}

function BetButton({ label, sub, onClick, disabled, highlight }: any) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "py-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center",
                disabled ? "opacity-50 cursor-not-allowed bg-slate-50 border-slate-100" :
                    highlight
                        ? "bg-indigo-50 border-indigo-200 hover:bg-indigo-100 text-indigo-700"
                        : "bg-white border-border hover:bg-slate-50 text-ink-700 hover:border-indigo-200"
            )}
        >
            <span className="font-bold text-sm">{label}</span>
            <span className="text-[10px] opacity-70 font-medium">{sub}</span>
        </button>
    );
}
