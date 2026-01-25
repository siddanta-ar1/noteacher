"use client";

import { motion } from "framer-motion";
import {
    Settings,
    Bell,
    Moon,
    Volume2,
    Globe,
    Shield,
    Mail,
    ChevronLeft,
    ChevronRight,
    User,
    LogOut,
    Zap
} from "lucide-react";
import Link from "next/link";
import { Badge, Card } from "@/components/ui";

interface SettingItemProps {
    icon: React.ElementType;
    title: string;
    description: string;
    action?: React.ReactNode;
}

function SettingItem({ icon: Icon, title, description, action }: SettingItemProps) {
    return (
        <div className="flex items-center justify-between py-4 border-b border-border last:border-0">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-surface-raised rounded-xl flex items-center justify-center text-ink-500">
                    <Icon size={20} />
                </div>
                <div>
                    <h4 className="font-bold text-ink-900">{title}</h4>
                    <p className="text-sm text-ink-400">{description}</p>
                </div>
            </div>
            {action}
        </div>
    );
}

function Toggle({ enabled = false }: { enabled?: boolean }) {
    return (
        <button
            className={`w-12 h-7 rounded-full transition-colors relative ${enabled ? "bg-power-teal" : "bg-ink-300"
                }`}
        >
            <motion.div
                initial={false}
                animate={{ x: enabled ? 22 : 2 }}
                className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
            />
        </button>
    );
}

export default function SettingsPage() {
    return (
        <div className="min-h-screen bg-surface-raised pb-20">
            {/* Header */}
            <header className="bg-white border-b border-border px-6 py-6">
                <div className="max-w-3xl mx-auto">
                    <Link
                        href="/home"
                        className="flex items-center gap-2 text-ink-400 hover:text-primary transition-colors font-bold text-sm mb-6"
                    >
                        <ChevronLeft size={18} />
                        <span>Back to Dashboard</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-primary-light rounded-2xl flex items-center justify-center">
                            <Settings className="text-primary" size={28} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-ink-900">Settings</h1>
                            <p className="text-ink-500">Manage your account and preferences</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-3xl mx-auto px-6 py-8 space-y-8">
                {/* Profile Section */}
                <Card padding="lg" rounded="3xl">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-power-purple rounded-2xl flex items-center justify-center text-white text-xl font-black">
                            JD
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-black text-ink-900">John Doe</h3>
                            <p className="text-ink-400">john@example.com</p>
                        </div>
                        <button className="px-4 py-2 bg-surface-raised text-ink-700 rounded-xl font-bold text-sm hover:bg-surface-sunken transition-colors flex items-center gap-2">
                            <User size={16} />
                            Edit Profile
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge variant="teal">
                            <Zap size={12} className="fill-current" />
                            Free Tier
                        </Badge>
                        <Badge variant="default">Member since Jan 2024</Badge>
                    </div>
                </Card>

                {/* Notifications */}
                <Card padding="lg" rounded="3xl">
                    <h3 className="text-lg font-black text-ink-900 mb-4 flex items-center gap-2">
                        <Bell size={20} className="text-ink-400" />
                        Notifications
                    </h3>
                    <SettingItem
                        icon={Mail}
                        title="Email Notifications"
                        description="Get updates about your progress"
                        action={<Toggle enabled />}
                    />
                    <SettingItem
                        icon={Bell}
                        title="Push Notifications"
                        description="Receive reminders on your device"
                        action={<Toggle />}
                    />
                </Card>

                {/* Preferences */}
                <Card padding="lg" rounded="3xl">
                    <h3 className="text-lg font-black text-ink-900 mb-4 flex items-center gap-2">
                        <Settings size={20} className="text-ink-400" />
                        Preferences
                    </h3>
                    <SettingItem
                        icon={Moon}
                        title="Dark Mode"
                        description="Switch between light and dark themes"
                        action={<Toggle />}
                    />
                    <SettingItem
                        icon={Volume2}
                        title="Sound Effects"
                        description="Play sounds for achievements"
                        action={<Toggle enabled />}
                    />
                    <SettingItem
                        icon={Globe}
                        title="Language"
                        description="English (US)"
                        action={
                            <button className="flex items-center gap-1 text-primary font-bold text-sm">
                                Change <ChevronRight size={16} />
                            </button>
                        }
                    />
                </Card>

                {/* Privacy */}
                <Card padding="lg" rounded="3xl">
                    <h3 className="text-lg font-black text-ink-900 mb-4 flex items-center gap-2">
                        <Shield size={20} className="text-ink-400" />
                        Privacy & Security
                    </h3>
                    <SettingItem
                        icon={Shield}
                        title="Two-Factor Authentication"
                        description="Add an extra layer of security"
                        action={
                            <button className="px-4 py-2 bg-primary text-white rounded-xl font-bold text-sm">
                                Enable
                            </button>
                        }
                    />
                </Card>

                {/* Danger Zone */}
                <Card padding="lg" rounded="3xl" className="border-error/20">
                    <h3 className="text-lg font-black text-error mb-4">Danger Zone</h3>
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-bold text-ink-900">Sign Out</h4>
                            <p className="text-sm text-ink-400">Log out from all devices</p>
                        </div>
                        <button className="px-4 py-2 bg-error-light text-error rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-error hover:text-white transition-colors">
                            <LogOut size={16} />
                            Sign Out
                        </button>
                    </div>
                </Card>
            </main>
        </div>
    );
}
