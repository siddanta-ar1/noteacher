"use client";

import { ErrorState } from "@/components/ui/ErrorState";

export default function HomeError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center p-8">
            <ErrorState
                title="Dashboard Error"
                message={error.message || "We couldn't load your dashboard. Please try again."}
                retryAction={reset}
                retryLabel="Reload Dashboard"
            />
        </div>
    );
}
