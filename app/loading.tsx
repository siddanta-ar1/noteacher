import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="w-12 h-12 text-navy animate-spin mx-auto mb-4" />
                <p className="text-slate-400 font-bold">Loading...</p>
            </div>
        </div>
    );
}
