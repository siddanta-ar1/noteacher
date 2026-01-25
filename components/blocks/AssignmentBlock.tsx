"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Upload,
    Camera,
    Mic,
    FileText,
    CheckCircle,
    Loader2,
    X,
    AlertCircle,
} from "lucide-react";
import type { AssignmentBlock, SubmissionType } from "@/types/content";

interface AssignmentBlockProps {
    block: AssignmentBlock;
    onComplete: () => void;
    isEnforcementEnabled?: boolean; // For MVP, can be toggled
}

/**
 * AssignmentBlock - Multi-type submission component (text, photo, audio)
 * Blueprint ready - actual upload enforcement can be enabled later
 */
export default function AssignmentBlockComponent({
    block,
    onComplete,
    isEnforcementEnabled = false, // Default: don't require submission to proceed
}: AssignmentBlockProps) {
    const {
        title,
        description,
        instructions,
        submissionTypes,
        isBlocking = false,
        maxFileSize = 10,
    } = block;

    const [activeType, setActiveType] = useState<SubmissionType | null>(null);
    const [textContent, setTextContent] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const typeIcons: Record<SubmissionType, React.ReactNode> = {
        text: <FileText className="w-5 h-5" />,
        photo: <Camera className="w-5 h-5" />,
        audio: <Mic className="w-5 h-5" />,
    };

    const typeLabels: Record<SubmissionType, string> = {
        text: "Text Response",
        photo: "Photo Upload",
        audio: "Audio Recording",
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size
        if (file.size > maxFileSize * 1024 * 1024) {
            setError(`File too large. Maximum size is ${maxFileSize}MB`);
            return;
        }

        setSelectedFile(file);
        setError(null);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError(null);

        // Simulate submission (in real implementation, upload to Supabase Storage)
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            setIsSubmitted(true);

            // If blocking and enforcement is enabled, unlock next section
            if (isBlocking && isEnforcementEnabled) {
                setTimeout(onComplete, 500);
            }
        } catch (err) {
            setError("Submission failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSkip = () => {
        if (!isBlocking || !isEnforcementEnabled) {
            onComplete();
        }
    };

    const clearSelection = () => {
        setActiveType(null);
        setTextContent("");
        setSelectedFile(null);
        setError(null);
    };

    if (isSubmitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-[2rem] border-2 border-green-200 p-8 md:p-10"
            >
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center">
                        <CheckCircle className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-green-700">
                            Submitted Successfully!
                        </h3>
                        <p className="text-green-600 text-sm">
                            Your work has been recorded
                        </p>
                    </div>
                </div>
                <p className="text-green-600 text-sm mt-4">
                    AI feedback will be available after review.
                </p>
            </motion.div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-slate-50 to-white rounded-[2rem] border-2 border-slate-100 p-8 md:p-10 shadow-lg">
            {/* Header */}
            <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 bg-power-orange/10 rounded-2xl flex items-center justify-center shrink-0">
                    <Upload className="w-7 h-7 text-power-orange" />
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <p className="text-xs font-bold uppercase tracking-widest text-power-orange">
                            Assignment
                        </p>
                        {isBlocking && isEnforcementEnabled && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded-full uppercase">
                                Required
                            </span>
                        )}
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
                        {title}
                    </h3>
                    {description && (
                        <p className="text-slate-500 mt-2">{description}</p>
                    )}
                </div>
            </div>

            {/* Instructions */}
            {instructions && (
                <div className="bg-slate-100 rounded-xl p-4 mb-6 text-sm text-slate-600">
                    {instructions}
                </div>
            )}

            {/* Submission type selection */}
            {!activeType && (
                <div className="space-y-3">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                        Choose submission type
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {submissionTypes.map((type) => (
                            <motion.button
                                key={type}
                                onClick={() => setActiveType(type)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="p-5 rounded-2xl border-2 border-slate-200 hover:border-navy hover:bg-navy/5 transition-all flex flex-col items-center gap-3"
                            >
                                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                                    {typeIcons[type]}
                                </div>
                                <span className="font-bold text-slate-700">
                                    {typeLabels[type]}
                                </span>
                            </motion.button>
                        ))}
                    </div>
                </div>
            )}

            {/* Active submission form */}
            <AnimatePresence>
                {activeType && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        {/* Back button */}
                        <button
                            onClick={clearSelection}
                            className="flex items-center gap-2 text-slate-400 hover:text-slate-600 text-sm font-bold mb-4"
                        >
                            <X className="w-4 h-4" />
                            Choose different type
                        </button>

                        {/* Text submission */}
                        {activeType === "text" && (
                            <div className="space-y-4">
                                <textarea
                                    placeholder="Write your response here..."
                                    value={textContent}
                                    onChange={(e) => setTextContent(e.target.value)}
                                    className="w-full h-48 p-4 rounded-2xl border-2 border-slate-200 focus:border-navy focus:outline-none resize-none text-slate-700"
                                />
                                <p className="text-xs text-slate-400">
                                    {textContent.length} characters
                                </p>
                            </div>
                        )}

                        {/* Photo submission */}
                        {activeType === "photo" && (
                            <div className="space-y-4">
                                {!selectedFile ? (
                                    <label className="block cursor-pointer">
                                        <div className="border-2 border-dashed border-slate-200 hover:border-navy rounded-2xl p-12 text-center transition-colors">
                                            <Camera className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                            <p className="font-bold text-slate-600 mb-2">
                                                Click to upload photo
                                            </p>
                                            <p className="text-sm text-slate-400">
                                                PNG, JPG up to {maxFileSize}MB
                                            </p>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                            className="hidden"
                                        />
                                    </label>
                                ) : (
                                    <div className="relative">
                                        <img
                                            src={URL.createObjectURL(selectedFile)}
                                            alt="Preview"
                                            className="w-full max-h-64 object-cover rounded-2xl"
                                        />
                                        <button
                                            onClick={() => setSelectedFile(null)}
                                            className="absolute top-2 right-2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Audio submission */}
                        {activeType === "audio" && (
                            <div className="space-y-4">
                                {!selectedFile ? (
                                    <label className="block cursor-pointer">
                                        <div className="border-2 border-dashed border-slate-200 hover:border-navy rounded-2xl p-12 text-center transition-colors">
                                            <Mic className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                            <p className="font-bold text-slate-600 mb-2">
                                                Upload audio file
                                            </p>
                                            <p className="text-sm text-slate-400">
                                                MP3, WAV up to {maxFileSize}MB
                                            </p>
                                        </div>
                                        <input
                                            type="file"
                                            accept="audio/*"
                                            onChange={handleFileSelect}
                                            className="hidden"
                                        />
                                    </label>
                                ) : (
                                    <div className="bg-slate-100 rounded-2xl p-4 flex items-center gap-4">
                                        <div className="w-12 h-12 bg-navy rounded-xl flex items-center justify-center">
                                            <Mic className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-slate-700 truncate">
                                                {selectedFile.name}
                                            </p>
                                            <p className="text-sm text-slate-400">
                                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setSelectedFile(null)}
                                            className="p-2 hover:bg-slate-200 rounded-lg"
                                        >
                                            <X className="w-4 h-4 text-slate-500" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Error display */}
                        {error && (
                            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                {error}
                            </div>
                        )}

                        {/* Submit button */}
                        <div className="flex items-center justify-between mt-6">
                            <button
                                onClick={handleSubmit}
                                disabled={
                                    isSubmitting ||
                                    (activeType === "text" && !textContent.trim()) ||
                                    (activeType !== "text" && !selectedFile)
                                }
                                className="px-8 py-4 bg-navy text-white rounded-2xl font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-navy-dark transition-colors"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-5 h-5" />
                                        Submit
                                    </>
                                )}
                            </button>

                            {(!isBlocking || !isEnforcementEnabled) && (
                                <button
                                    onClick={handleSkip}
                                    className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                                >
                                    Skip for now →
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Skip option when no type selected */}
            {!activeType && (!isBlocking || !isEnforcementEnabled) && (
                <div className="mt-6 text-center">
                    <button
                        onClick={handleSkip}
                        className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                    >
                        Skip and continue →
                    </button>
                </div>
            )}
        </div>
    );
}
