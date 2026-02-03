"use client";

import { ErrorState } from "@/components/ui/ErrorState";

export default function CourseError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center p-8">
            <ErrorState
                title="Course Load Failed"
                message={error.message || "We couldn't load this course. Please try again."}
                retryAction={reset}
                retryLabel="Reload Course"
            />
        </div>
    );
}
