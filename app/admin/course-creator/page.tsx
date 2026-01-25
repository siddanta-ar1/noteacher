"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, Button, Input } from "@/components/ui";
import { CheckCircle2, AlertCircle, Copy, Play } from "lucide-react";

const SAMPLE_JSON = {
    "title": "Quantum Computing 101",
    "description": "Unlock the mysteries of the quantum realm.",
    "nodes": [
        {
            "title": "Superposition",
            "type": "lesson",
            "content": {
                "blocks": [
                    {
                        "type": "text",
                        "content": "Imagine a coin that is spinning..."
                    },
                    {
                        "type": "quiz",
                        "question": "Can a qubit be 0 and 1 at the same time?",
                        "options": ["Yes", "No"],
                        "correctIndex": 0
                    }
                ]
            }
        },
        {
            "title": "Entanglement",
            "type": "assignment",
            "content": {
                "blocks": [
                    { "type": "text", "content": "Entanglement is spooky action at a distance." }
                ]
            }
        }
    ]
};

export default function CourseCreatorPage() {
    const [jsonInput, setJsonInput] = useState(JSON.stringify(SAMPLE_JSON, null, 2));
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = async () => {
        setStatus("loading");
        setMessage("");

        try {
            // Validate JSON parsing first
            let parsedBody;
            try {
                parsedBody = JSON.parse(jsonInput);
            } catch (e) {
                setStatus("error");
                setMessage("Invalid JSON format. Please check your syntax.");
                return;
            }

            const res = await fetch("/api/admin/create-course", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(parsedBody),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to create course");
            }

            setStatus("success");
            setMessage(`Course created! ID: ${data.courseId}`);
        } catch (error: any) {
            setStatus("error");
            setMessage(error.message);
        }
    };

    const copySample = () => {
        setJsonInput(JSON.stringify(SAMPLE_JSON, null, 2));
    };

    return (
        <div className="min-h-screen bg-surface-raised p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <header>
                    <h1 className="text-3xl font-black text-ink-900 mb-2">JSON Course Engine</h1>
                    <p className="text-ink-500">Paste your JSON definition below to generate a new course instantly.</p>
                </header>

                <div className="grid md:grid-cols-2 gap-8 h-[600px]">
                    {/* Input Area */}
                    <div className="flex flex-col h-full">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-bold text-ink-700">Course Definition (JSON)</label>
                            <button onClick={copySample} className="text-xs text-primary font-bold flex items-center gap-1 hover:underline">
                                <Copy size={12} /> Reset to Sample
                            </button>
                        </div>
                        <textarea
                            value={jsonInput}
                            onChange={(e) => setJsonInput(e.target.value)}
                            className="flex-1 w-full bg-white border border-border rounded-xl p-4 font-mono text-sm text-ink-900 focus:ring-2 focus:ring-primary outline-none resize-none shadow-inner"
                            spellCheck={false}
                        />
                    </div>

                    {/* Preview / Status Area */}
                    <div className="flex flex-col gap-6">
                        <Card padding="lg" rounded="3xl">
                            <h3 className="text-lg font-black text-ink-900 mb-4">Engine Status</h3>

                            {status === "idle" && (
                                <div className="text-ink-400 text-sm">Ready to process...</div>
                            )}

                            {status === "loading" && (
                                <div className="flex items-center gap-3 text-primary font-bold">
                                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                    Processing Blueprint...
                                </div>
                            )}

                            {status === "success" && (
                                <div className="bg-success-light/20 p-4 rounded-xl border border-success/20">
                                    <div className="flex items-center gap-2 text-success font-black mb-2">
                                        <CheckCircle2 size={20} />
                                        Success!
                                    </div>
                                    <p className="text-ink-700 text-sm">{message}</p>
                                </div>
                            )}

                            {status === "error" && (
                                <div className="bg-error-light/20 p-4 rounded-xl border border-error/20">
                                    <div className="flex items-center gap-2 text-error font-black mb-2">
                                        <AlertCircle size={20} />
                                        Error
                                    </div>
                                    <p className="text-ink-700 text-sm font-mono">{message}</p>
                                </div>
                            )}
                        </Card>

                        <div className="mt-auto">
                            <button
                                onClick={handleSubmit}
                                disabled={status === "loading"}
                                className="w-full py-4 bg-primary text-white rounded-xl font-black text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-3"
                            >
                                <Play size={24} className="fill-white" />
                                {status === "loading" ? "Building..." : "Run Engine"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
