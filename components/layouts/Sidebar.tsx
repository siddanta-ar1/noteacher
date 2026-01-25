"use client";

import React from "react";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, LayoutDashboard, BookOpen, Trophy, Settings, HelpCircle, Sparkles } from "lucide-react";
import { cn } from "@/utils/cn";
import { ROUTES } from "@/config/routes";
import { ComingSoonModal } from "@/components/ui";

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
                "flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all font-bold relative group",
                active
                    ? "bg-primary text-white shadow-lg"
                    : "text-ink-500 hover:bg-surface-sunken hover:text-primary"
            )}
            style={active ? { boxShadow: "var(--shadow-primary)" } : {}}
        >
            {/* Active indicator bar */}
            {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full -ml-4" />
            )}
            <Icon size={20} className={active ? "" : "group-hover:scale-110 transition-transform"} />
            <span className="hidden lg:block">{label}</span>
        </Link>
    );
}

export function Sidebar() {
    const pathname = usePathname();
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    const navItems = [
        { href: ROUTES.HOME, icon: LayoutDashboard, label: "Dashboard" },
        { href: ROUTES.COURSES, icon: BookOpen, label: "My Courses" },
        { href: ROUTES.LEADERBOARD, icon: Trophy, label: "Leaderboard" },
    ];

    return (
        <>
            <aside className="w-20 lg:w-72 bg-white border-r border-border p-4 lg:p-6 sticky top-0 h-screen z-50 flex flex-col">
                {/* Logo */}
                <Link href={ROUTES.HOME} className="flex items-center gap-3 mb-10 px-2 group">
                    <div className="bg-primary p-2.5 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow" style={{ boxShadow: "var(--shadow-primary)" }}>
                        <Zap className="text-white w-6 h-6 fill-white" />
                    </div>
                    <span className="text-2xl font-black text-primary hidden lg:block italic tracking-tighter">
                        NOT<span className="text-power-purple">Eacher</span>
                    </span>
                </Link>

                {/* Main Navigation */}
                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => (
                        <NavTab
                            key={item.href}
                            href={item.href}
                            icon={item.icon}
                            label={item.label}
                            active={pathname === item.href}
                        />
                    ))}
                </nav>

                {/* Divider */}
                <div className="border-t border-border my-4" />

                {/* Secondary Navigation */}
                <nav className="space-y-2">
                    <NavTab
                        href="/settings"
                        icon={Settings}
                        label="Settings"
                        active={pathname === "/settings"}
                    />
                    <NavTab
                        href="/help"
                        icon={HelpCircle}
                        label="Help & Support"
                        active={pathname === "/help"}
                    />
                </nav>

                {/* Pro Upgrade Card */}
                <div className="hidden lg:block mt-6 p-4 bg-gradient-to-br from-power-purple to-indigo-600 rounded-2xl text-white">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={16} className="fill-white" />
                        <span className="text-xs font-bold uppercase tracking-wider opacity-80">Pro</span>
                    </div>
                    <p className="text-sm font-bold mb-3">Unlock all courses & AI features</p>
                    <button
                        onClick={() => setShowUpgradeModal(true)}
                        className="w-full py-2 bg-white text-power-purple rounded-xl font-bold text-sm hover:bg-white/90 transition-colors"
                    >
                        Upgrade Now
                    </button>
                </div>
            </aside>

            {/* Coming Soon Modal */}
            <ComingSoonModal
                isOpen={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
                feature="Pro subscription"
            />
        </>
    );
}
