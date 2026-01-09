// - Updated isImmersive logic
"use client";
import "./globals.css";
import { usePathname } from "next/navigation";
import { Zap, LayoutDashboard, BookOpen, Trophy } from "lucide-react";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Full-screen pages for maximum focus and premium landing experience
  const isImmersive =
    pathname === "/" || // Added root to immersive
    pathname === "/login" ||
    pathname === "/interest" ||
    pathname === "/simulator" ||
    pathname.startsWith("/lesson");

  return (
    <html lang="en">
      <body className="selection:bg-navy/10 bg-white">
        <div className="flex min-h-screen">
          {!isImmersive && (
            <aside className="w-20 lg:w-72 bg-white border-r border-slate-100 p-6 sticky top-0 h-screen z-50 flex flex-col">
              <Link href="/home" className="flex items-center gap-3 mb-12 px-2">
                <div className="bg-navy p-2.5 rounded-[1rem] shadow-lg shadow-navy/20">
                  <Zap className="text-white w-6 h-6 fill-white" />
                </div>
                <span className="text-2xl font-black text-navy hidden lg:block italic tracking-tighter">
                  NOT<span className="text-power-purple">Eacher</span>
                </span>
              </Link>

              <div className="flex-1 space-y-3">
                <NavTab
                  href="/home"
                  icon={LayoutDashboard}
                  label="Dashboard"
                  active={pathname === "/home"}
                />
                <NavTab
                  href="/courses"
                  icon={BookOpen}
                  label="My Arcs"
                  active={pathname === "/courses"}
                />
                <NavTab
                  href="/leaderboard"
                  icon={Trophy}
                  label="Leaderboard"
                  active={pathname === "/leaderboard"}
                />
              </div>
            </aside>
          )}

          <main
            className={`flex-1 ${isImmersive ? "w-full" : "overflow-y-auto"}`}
          >
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

function NavTab({ href, icon: Icon, label, active }: any) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-4 p-4 rounded-[1.25rem] transition-all font-bold ${
        active
          ? "bg-navy text-white shadow-xl shadow-navy/20"
          : "text-slate-400 hover:bg-slate-50 hover:text-navy"
      }`}
    >
      <Icon size={22} />
      <span className="hidden lg:block">{label}</span>
    </Link>
  );
}
