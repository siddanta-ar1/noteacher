import PathNode from "@/components/PathNode";

const MOCK_NODES = [
  {
    id: "1",
    title: "Intro to Logic Gates",
    status: "completed",
    position: "center",
  },
  {
    id: "2",
    title: "The NAND Gate Challenge",
    status: "current",
    position: "right",
  },
  { id: "3", title: "Building an Adder", status: "locked", position: "left" },
  {
    id: "4",
    title: "Memory and Latches",
    status: "locked",
    position: "center",
  },
] as const;

export default function Home() {
  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="p-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-white italic">
          NOT<span className="text-brand-primary">Eacher</span>
        </h1>
        <p className="text-slate-400 mt-2">Computer Architecture Path</p>
      </header>

      {/* The Path Container */}
      <div className="max-w-2xl mx-auto px-6 relative mt-10">
        {/* Visual Connector Line (Static for now) */}
        <div className="absolute left-1/2 top-0 w-1 h-full bg-slate-800 -translate-x-1/2 -z-10 hidden md:block" />

        {MOCK_NODES.map((node, index) => (
          <PathNode key={node.id} index={index} {...node} />
        ))}
      </div>
    </main>
  );
}
