"use client";

import React from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "./Button";

interface ErrorStateProps {
    title?: string;
    message?: string;
    retryAction?: () => void;
    retryLabel?: string;
}

export function ErrorState({
    title = "Something went wrong",
    message = "We encountered an error while loading this content.",
    retryAction,
    retryLabel = "Try Again"
}: ErrorStateProps) {
    return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center animate-fade-in">
            <div className="w-20 h-20 bg-error-light rounded-full flex items-center justify-center mb-6 shadow-lg shadow-error/10">
                <AlertTriangle className="text-error w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-ink-900 mb-2">{title}</h3>
            <p className="text-ink-500 font-medium max-w-md mb-8 leading-relaxed">
                {message}
            </p>
            {retryAction && (
                <Button
                    onClick={retryAction}
                    variant="outline"
                    className="border-2 hover:border-error hover:text-error hover:bg-error-light"
                >
                    <RefreshCcw size={18} className="mr-2" />
                    {retryLabel}
                </Button>
            )}
        </div>
    );
}
