"use client";

import { motion } from "framer-motion";
import { Ghost, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-surface-base flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-power-purple/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
            </div>

            <div className="max-w-md w-full text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-32 h-32 bg-surface-raised rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-xl border border-white/50"
                >
                    <Ghost size={64} className="text-ink-300" />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-6xl font-black text-ink-900 mb-2"
                >
                    404
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl font-bold text-ink-700 mb-4"
                >
                    Page Not Found
                </motion.p>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-ink-500 mb-8"
                >
                    Looks like this page has vanished into the void.
                    Or maybe it never existed in the first place?
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link href="/home" className="w-full sm:w-auto">
                        <Button size="lg" className="w-full sm:w-auto gap-2">
                            <Home size={18} />
                            Back to Dashboard
                        </Button>
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-3 rounded-xl font-bold text-ink-500 hover:bg-surface-raised transition-colors w-full sm:w-auto flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={18} />
                        Go Back
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
