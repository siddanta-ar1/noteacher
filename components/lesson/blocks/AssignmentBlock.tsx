"use client";

import { useState } from "react";
import { UploadCloud, FileCheck, Loader2 } from "lucide-react";
import { toast } from "sonner"; // Optional: Remove if you haven't installed 'sonner'

type AssignmentBlockProps = {
  title: string;
  description: string;
  onComplete: () => void;
};

export default function AssignmentBlock({
  title,
  description,
  onComplete,
}: AssignmentBlockProps) {
  const [status, setStatus] = useState<"idle" | "uploading" | "done">("idle");

  const handleUpload = () => {
    if (status !== "idle") return;
    setStatus("uploading");

    // Simulate network upload delay
    setTimeout(() => {
      setStatus("done");
      onComplete(); // Unlocks the next section
      // toast.success("Assignment submitted!");
    }, 2000);
  };

  return (
    <div
      className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-[2rem] p-8 md:p-12 text-center transition-all hover:border-navy hover:bg-slate-100 group cursor-pointer"
      onClick={handleUpload}
    >
      <div className="max-w-md mx-auto space-y-6 pointer-events-none">
        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
          {status === "done" ? (
            <FileCheck className="text-power-green w-8 h-8" />
          ) : status === "uploading" ? (
            <Loader2 className="text-navy w-8 h-8 animate-spin" />
          ) : (
            <UploadCloud className="text-navy w-8 h-8" />
          )}
        </div>

        <div>
          <h3 className="text-lg font-black text-slate-900 uppercase tracking-wide mb-2">
            {title}
          </h3>
          <p className="text-slate-500 font-medium leading-relaxed">
            {description}
          </p>
        </div>

        <button
          disabled={status !== "idle"}
          className={`
            w-full py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all
            ${
              status === "done"
                ? "bg-power-green text-white"
                : "bg-navy text-white group-hover:bg-navy-dark shadow-lg shadow-navy/20"
            }
          `}
        >
          {status === "idle" && "Select File to Upload"}
          {status === "uploading" && "Uploading..."}
          {status === "done" && "Submission Received"}
        </button>

        {status === "idle" && (
          <p className="text-xs text-slate-400 font-bold">
            Supported: PDF, PNG, IPYNB (Max 10MB)
          </p>
        )}
      </div>
    </div>
  );
}
