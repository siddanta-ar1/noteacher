"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui";
import { CheckCircle2, AlertCircle, Copy, Play, Save, Download } from "lucide-react";

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
    const [courseId, setCourseId] = useState("");
    const [isEditMode, setIsEditMode] = useState(false);

    const handleLoad = async () => {
        if (!courseId) return;
        setStatus("loading");
        setMessage("Fetching course...");

        try {
            const res = await fetch(`/api/admin/course/${courseId}`);
            if (!res.ok) throw new Error("Course not found");
            const data = await res.json();
            setJsonInput(JSON.stringify(data, null, 2));
            setIsEditMode(true);
            setStatus("idle");
            setMessage("");
        } catch (error: any) {
            setStatus("error");
            setMessage(error.message);
        }
    };

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

            const url = isEditMode ? `/api/admin/course/${courseId}` : "/api/admin/create-course";
            const method = isEditMode ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(parsedBody),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to save course");
            }

            setStatus("success");
            setMessage(isEditMode ? "Course updated successfully!" : `Course created! ID: ${data.courseId}`);

            if (!isEditMode && data.courseId) {
                setCourseId(data.courseId);
                setIsEditMode(true); // Switch to edit mode after creation
            }
        } catch (error: any) {
            setStatus("error");
            setMessage(error.message);
        }
    };

    const copySample = () => {
        setJsonInput(JSON.stringify(SAMPLE_JSON, null, 2));
        setIsEditMode(false);
        setCourseId("");
    };

    return (
        <div className="min-h-screen bg-surface-raised p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-ink-900 mb-2">JSON Course Engine</h1>
                        <p className="text-ink-500">Create or Edit courses using JSON definitions.</p>
                    </div>
                    {/* Load Existing */}
                    <div className="flex items-center gap-2 bg-surface p-2 rounded-xl border border-border">
                        <input
                            type="text"
                            placeholder="Course ID to Load..."
                            value={courseId}
                            onChange={(e) => setCourseId(e.target.value)}
                            className="bg-transparent text-sm font-bold text-ink-900 placeholder:text-ink-300 outline-none px-2 w-64"
                        />
                        <button
                            onClick={handleLoad}
                            disabled={!courseId}
                            className="p-2 bg-surface-raised hover:bg-surface-sunken rounded-lg text-ink-500 hover:text-primary transition-colors disabled:opacity-50"
                            title="Load Course"
                        >
                            <Download size={20} />
                        </button>
                    </div>
                </header>

                <div className="grid md:grid-cols-2 gap-8 h-[700px]">
                    {/* Input Area */}
                    <div className="flex flex-col h-full">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-bold text-ink-700 flex items-center gap-2">
                                {isEditMode ? <span className="text-power-orange flex items-center gap-1"><Save size={14} /> Editing Mode</span> : <span className="text-success flex items-center gap-1"><Play size={14} /> Creation Mode</span>}
                            </label>
                            <button onClick={copySample} className="text-xs text-primary font-bold flex items-center gap-1 hover:underline">
                                <Copy size={12} /> Reset to Sample
                            </button>
                        </div>
                        <textarea
                            value={jsonInput}
                            onChange={(e) => setJsonInput(e.target.value)}
                            className="flex-1 w-full bg-surface border border-border rounded-xl p-4 font-mono text-sm text-ink-900 focus:ring-2 focus:ring-primary outline-none resize-none shadow-inner leading-relaxed"
                            spellCheck={false}
                        />
                    </div>

                    {/* Preview / Status Area */}
                    <div className="flex flex-col gap-6">
                        <Card padding="lg" rounded="3xl">
                            <h3 className="text-lg font-black text-ink-900 mb-4">Engine Console</h3>

                            {status === "idle" && (
                                <div className="text-ink-400 text-sm">{isEditMode ? "Ready to update..." : "Ready to create..."}</div>
                            )}

                            {status === "loading" && (
                                <div className="flex items-center gap-3 text-primary font-bold">
                                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                    Processing...
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
                                className={`w-full py-4 rounded-xl font-black text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-3 text-white
                                    ${isEditMode ? "bg-power-orange" : "bg-primary"}
                                `}
                            >
                                {isEditMode ? <Save size={24} /> : <Play size={24} className="fill-white" />}
                                {status === "loading" ? "Processing..." : isEditMode ? "Update Course" : "Create Course"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
