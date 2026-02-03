"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie } from "lucide-react";

export function CookieBanner() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("noteacher_cookie_consent");
        if (!consent) {
            // Delay slightly for better ux
            const timer = setTimeout(() => setShow(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("noteacher_cookie_consent", "true");
        setShow(false);
    };

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 bg-ink-900 text-white p-6 rounded-2xl shadow-2xl z-50 flex flex-col gap-4 border border-ink-800"
                >
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-ink-800 rounded-xl flex items-center justify-center shrink-0">
                            <Cookie size={20} className="text-primary" />
                        </div>
                        <div>
                            <h4 className="font-bold mb-1">We use cookies</h4>
                            <p className="text-sm text-ink-300">
                                To improve your learning experience and analyze traffic.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleAccept}
                            className="flex-1 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-hover transition-colors"
                        >
                            Accept All
                        </button>
                        <button
                            onClick={() => setShow(false)}
                            className="px-4 py-2.5 bg-ink-800 text-ink-300 rounded-xl font-bold text-sm hover:bg-ink-700 transition-colors"
                        >
                            Decline
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
