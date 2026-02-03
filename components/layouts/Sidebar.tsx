"use client";

import React from "react";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Zap, LayoutDashboard, BookOpen, Trophy, Settings, HelpCircle, Sparkles, Wrench } from "lucide-react";
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
            <aside className="w-20 lg:w-72 bg-white border-r border-border p-4 lg:p-6 sticky top-0 h-screen z-50 flex flex-col overflow-y-auto custom-scrollbar">
                {/* Logo */}
                <Link href={ROUTES.HOME} className="flex items-center gap-3 mb-10 px-2 group">
                    <div className="relative w-10 h-10 transition-all">
                        <Image
                            src="/logo.png"
                            alt="NOTEacher Logo"
                            fill
                            className="object-contain rounded-xl"
                            priority
                        />
                    </div>
                    <span className="text-2xl font-black text-primary hidden lg:block italic tracking-tight">
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
                    <NavTab
                        href="/admin/course-creator"
                        icon={Wrench}
                        label="Admin Engine"
                        active={pathname === "/admin/course-creator"}
                    />
                </nav>

                {/* Pro Upgrade Card */}
                <div className="hidden lg:block mt-8">
                    <div className="p-4 bg-ink-900 rounded-2xl text-white shadow-lg relative overflow-hidden group border border-ink-800">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-colors" />

                        <div className="flex items-center justify-between mb-3 relative z-10">
                            <span className="text-xs font-black uppercase tracking-widest text-primary-light">Pro</span>
                            <Sparkles size={14} className="text-primary-light" />
                        </div>

                        <p className="text-sm font-bold text-white mb-4 relative z-10 leading-snug">
                            Unlock the full<br />experience.
                        </p>

                        <button
                            onClick={() => setShowUpgradeModal(true)}
                            className="relative z-10 w-full py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-2"
                        >
                            Upgrade Now
                        </button>
                    </div>
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
