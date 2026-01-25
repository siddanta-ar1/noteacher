"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, LayoutDashboard, BookOpen, Trophy } from "lucide-react";
import { cn } from "@/utils/cn";
import { ROUTES } from "@/config/routes";

interface NavTabProps {
    href: string;
    icon: React.ElementType;
    label: string;
    active?: boolean;
}

function NavTab({ href, icon: Icon, label, active }: NavTabProps) {
    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-4 p-4 rounded-[1.25rem] transition-all font-bold",
                active
                    ? "bg-navy text-white shadow-xl shadow-navy/20"
                    : "text-slate-400 hover:bg-slate-50 hover:text-navy"
            )}
        >
            <Icon size={22} />
            <span className="hidden lg:block">{label}</span>
        </Link>
    );
}

export function Sidebar() {
    const pathname = usePathname();

    const navItems = [
        { href: ROUTES.HOME, icon: LayoutDashboard, label: "Dashboard" },
        { href: ROUTES.COURSES, icon: BookOpen, label: "My Arcs" },
        { href: ROUTES.LEADERBOARD, icon: Trophy, label: "Leaderboard" },
    ];

    return (
        <aside className="w-20 lg:w-72 bg-white border-r border-slate-100 p-6 sticky top-0 h-screen z-50 flex flex-col">
            <Link href={ROUTES.HOME} className="flex items-center gap-3 mb-12 px-2">
                <div className="bg-navy p-2.5 rounded-[1rem] shadow-lg shadow-navy/20">
                    <Zap className="text-white w-6 h-6 fill-white" />
                </div>
                <span className="text-2xl font-black text-navy hidden lg:block italic tracking-tighter">
                    NOT<span className="text-power-purple">Eacher</span>
                </span>
            </Link>

            <div className="flex-1 space-y-3">
                {navItems.map((item) => (
                    <NavTab
                        key={item.href}
                        href={item.href}
                        icon={item.icon}
                        label={item.label}
                        active={pathname === item.href}
                    />
                ))}
            </div>
        </aside>
    );
}
