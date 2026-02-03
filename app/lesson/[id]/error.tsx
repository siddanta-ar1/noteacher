"use client";

import { ErrorState } from "@/components/ui/ErrorState";

export default function LessonError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-surface-raised">
            <ErrorState
                title="Lesson Load Failed"
                message={error.message || "We couldn't load this lesson. Please try again."}
                retryAction={reset}
                retryLabel="Reload Lesson"
            />
        </div>
    );
}
