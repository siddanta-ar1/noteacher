// components/ui/PlayfulButton.tsx

export const PlayfulButton = ({ children, className, onClick }: any) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative px-8 py-3 font-bold text-white transition-all rounded-xl",
        "bg-brand-indigo border-b-4 border-indigo-900 active:border-b-0 active:translate-y-1",
        className,
      )}
    >
      {children}
    </button>
  );
};
