"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SearchResult {
    id: string;
    title: string;
    type: "course" | "lesson";
    url: string;
}

// Mock Data for Demo
const MOCK_RESULTS: SearchResult[] = [
    { id: "1", title: "Digital Logic & Architecture", type: "course", url: "/course/e53b432c-7a7c-43dd-944f-33fa66fcdf38" },
    { id: "2", title: "Boolean Algebra Basics", type: "lesson", url: "/lesson/1" },
    { id: "3", title: "Logic Gates", type: "lesson", url: "/lesson/2" },
    { id: "4", title: "Karnaugh Maps", type: "lesson", url: "/lesson/3" },
    { id: "5", title: "Propogation Delay", type: "lesson", url: "/lesson/4" },
];

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const router = useRouter();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                // We'll rely on parent to open, but we can't toggle here easily without callback prop being a toggler
                // Ideally this listener should be at the Layout level.
            }
            if (e.key === "Escape") {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }
        const lowerQuery = query.toLowerCase();
        const filtered = MOCK_RESULTS.filter(r =>
            r.title.toLowerCase().includes(lowerQuery)
        );
        setResults(filtered);
    }, [query]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    onClick={onClose}
                />

                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: -20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: -20 }}
                    className="w-full max-w-xl bg-surface rounded-2xl shadow-2xl overflow-hidden relative z-10 flex flex-col max-h-[60vh]"
                >
                    <div className="flex items-center px-4 py-4 border-b border-border gap-3">
                        <Search className="text-ink-400" size={20} />
                        <input
                            autoFocus
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search for courses, lessons, concepts..."
                            className="flex-1 bg-transparent outline-none text-lg text-ink-900 placeholder:text-ink-300 font-medium"
                        />
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-surface-raised rounded-lg text-ink-400"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2">
                        {results.length > 0 ? (
                            <div className="space-y-1">
                                {results.map((result) => (
                                    <button
                                        key={result.id}
                                        onClick={() => {
                                            router.push(result.url);
                                            onClose();
                                        }}
                                        className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-surface-raised transition-colors group text-left"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                                <BookOpen size={16} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-ink-900">{result.title}</div>
                                                <div className="text-xs text-ink-400 capitalize">{result.type}</div>
                                            </div>
                                        </div>
                                        <ChevronRight size={16} className="text-ink-300 group-hover:text-primary transition-colors" />
                                    </button>
                                ))}
                            </div>
                        ) : query ? (
                            <div className="p-8 text-center text-ink-400">
                                No results found for "{query}"
                            </div>
                        ) : (
                            <div className="p-4">
                                <h4 className="text-xs font-bold text-ink-400 uppercase tracking-wider mb-2">Suggested</h4>
                                <div className="space-y-1">
                                    {MOCK_RESULTS.slice(0, 3).map((result) => (
                                        <button
                                            key={result.id}
                                            onClick={() => {
                                                router.push(result.url);
                                                onClose();
                                            }}
                                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-raised transition-colors text-left"
                                        >
                                            <Search size={16} className="text-ink-400" />
                                            <span className="font-medium text-ink-700">{result.title}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
