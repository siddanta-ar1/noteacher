// app/layout.tsx
import "./globals.css";
import { Zap, Menu, BookOpen, Award, Settings } from "lucide-react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-200 selection:bg-blue-500/30">
        <div className="flex min-h-screen">
          {/* Side Navigation - Based on your prototype */}
          <nav className="w-20 lg:w-72 bg-slate-900/80 backdrop-blur-xl border-r border-slate-800 flex flex-col p-5 sticky top-0 h-screen">
            <div className="flex items-center gap-4 mb-12 px-3">
              <div className="bg-gradient-to-tr from-blue-600 to-emerald-500 p-2 rounded-xl">
                <Zap className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-black text-white hidden lg:block italic">
                NOTEacher
              </span>
            </div>

            <div className="flex-1 space-y-4">
              <NavItem icon={Menu} label="Dashboard" active />
              <NavItem icon={BookOpen} label="My Learning" />
              <NavItem icon={Award} label="Quests" />
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1 p-8 lg:p-16">{children}</main>
        </div>
      </body>
    </html>
  );
}

function NavItem({
  icon: Icon,
  label,
  active = false,
}: {
  icon: any;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-2xl transition-all cursor-pointer ${
        active
          ? "bg-blue-600 text-white shadow-lg"
          : "text-slate-400 hover:bg-slate-800"
      }`}
    >
      <Icon size={22} />
      <span className="font-semibold hidden lg:block">{label}</span>
    </div>
  );
}
