import { cn } from "@/lib/utils"; // <--- ADD THIS IMPORT

export const PlayfulButton = ({ children, className, onClick }: any) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative px-8 py-3 font-bold text-white transition-all rounded-xl",
        "bg-indigo-600 border-b-4 border-indigo-900 active:border-b-0 active:translate-y-1", // Changed bg-brand-indigo to bg-indigo-600 to ensure it works if custom colors aren't set
        className,
      )}
    >
      {children}
    </button>
  );
};
