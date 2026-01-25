"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Global Error:", error);
    }, [error]);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="text-center max-w-lg">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
                    <AlertTriangle className="w-10 h-10 text-red-500" />
                </div>

                <h1 className="text-4xl font-black text-slate-900 mb-4">
                    Oops! System Error
                </h1>

                <p className="text-slate-500 text-lg mb-2">
                    Something went wrong while loading this page.
                </p>

                {error.message && (
                    <p className="text-sm text-red-500 font-mono bg-red-50 p-3 rounded-xl mb-8">
                        {error.message}
                    </p>
                )}

                <div className="flex gap-4 justify-center">
                    <button
                        onClick={reset}
                        className="px-6 py-3 bg-navy text-white rounded-xl font-bold flex items-center gap-2 hover:shadow-lg transition-all"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                    </button>

                    <Link
                        href="/home"
                        className="px-6 py-3 bg-white text-navy border-2 border-slate-200 rounded-xl font-bold flex items-center gap-2 hover:border-navy transition-all"
                    >
                        <Home className="w-4 h-4" />
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
