"use client";

import React from "react";

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
import { getProfile } from "@/services/profile.service";

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

function Toggle({ enabled = false, onClick }: { enabled?: boolean; onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
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
    const [profile, setProfile] = React.useState<any>(null); // Use proper type if available
    const [loading, setLoading] = React.useState(true);
    const [isEditing, setIsEditing] = React.useState(false);
    const [editName, setEditName] = React.useState("");

    // Mock state for toggles
    const [settings, setSettings] = React.useState({
        emailParams: true,
        pushParams: false,
        darkMode: false,
        sound: true
    });

    const handleToggle = async (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
        const { toast } = await import("sonner");
        toast.success("Preference updated");
    };

    const handleSignOut = async () => {
        try {
            const { createBrowserClient } = await import("@supabase/ssr");
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );
            await supabase.auth.signOut();
            window.location.href = "/login";
        } catch (error) {
            console.error(error);
        }
    };

    React.useEffect(() => {
        async function loadProfile() {
            try {
                const { data, error } = await getProfile();
                if (error) {
                    console.error("Settings loadProfile error:", error);
                }
                if (data) {
                    setProfile(data);
                }
            } catch (e) {
                console.error("Settings loadProfile exception:", e);
            } finally {
                setLoading(false);
            }
        }
        loadProfile();
    }, []);

    const displayProfile = profile || {
        full_name: "Guest User",
        email: "guest@example.com"
    };

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
                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
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
                        <div className="relative group">
                            <div className="w-16 h-16 bg-surface-raised rounded-2xl flex items-center justify-center text-ink-400 text-xl font-black overflow-hidden relative border border-border">
                                {displayProfile.avatar_url ? (
                                    <img src={displayProfile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    displayProfile.full_name ? displayProfile.full_name.substring(0, 2).toUpperCase() : "GU"
                                )}
                                <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <User size={20} className="text-white" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;

                                            try {
                                                const { toast } = await import("sonner");
                                                toast.loading("Uploading avatar...");

                                                const { createBrowserClient } = await import("@supabase/ssr");
                                                const supabase = createBrowserClient(
                                                    process.env.NEXT_PUBLIC_SUPABASE_URL!,
                                                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
                                                );

                                                const fileExt = file.name.split('.').pop();
                                                const fileName = `${displayProfile.id}-${Math.random()}.${fileExt}`;
                                                const { error: uploadError } = await supabase.storage
                                                    .from('avatars')
                                                    .upload(fileName, file);

                                                if (uploadError) throw uploadError;

                                                const { data: { publicUrl } } = supabase.storage
                                                    .from('avatars')
                                                    .getPublicUrl(fileName);

                                                const { updateProfile } = await import("@/services/profile.service");
                                                const { error: updateError } = await updateProfile({ avatar_url: publicUrl });

                                                if (updateError) throw updateError;

                                                setProfile({ ...profile, avatar_url: publicUrl });
                                                toast.dismiss();
                                                toast.success("Avatar updated!");
                                            } catch (err) {
                                                const { toast } = await import("sonner");
                                                toast.dismiss();
                                                toast.error("Failed to upload avatar");
                                                console.error(err);
                                            }
                                        }}
                                    />
                                </label>
                            </div>
                        </div>
                        <div className="flex-1">
                            {isEditing ? (
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="font-black text-ink-900 bg-surface-base border border-border rounded px-2 py-1 w-full"
                                        placeholder="Full Name"
                                    />
                                </div>
                            ) : (
                                <h3 className="text-lg font-black text-ink-900">{displayProfile.full_name || "Guest User"}</h3>
                            )}
                            <p className="text-ink-400">{displayProfile.email || "No Email"}</p>
                        </div>
                        <button
                            onClick={async () => {
                                if (isEditing) {
                                    // Save
                                    try {
                                        const { toast } = await import("sonner");
                                        const { updateProfile } = await import("@/services/profile.service");
                                        const { error } = await updateProfile({ full_name: editName });
                                        if (error) throw error;
                                        setProfile({ ...profile, full_name: editName });
                                        setIsEditing(false);
                                        toast.success("Profile updated");
                                    } catch (e) {
                                        const { toast } = await import("sonner");
                                        toast.error("Failed to update profile");
                                    }
                                } else {
                                    setEditName(displayProfile.full_name || "");
                                    setIsEditing(true);
                                }
                            }}
                            className={`px-4 py-2 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 ${isEditing ? 'bg-primary text-white' : 'bg-surface-raised text-ink-700 hover:bg-surface-sunken'}`}
                        >
                            <User size={16} />
                            {isEditing ? "Save" : "Edit Profile"}
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge variant="teal">
                            <Zap size={12} className="fill-current" />
                            Free Tier
                        </Badge>
                        <Badge variant="default">Member since Jan 2026</Badge>
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
                        action={<Toggle enabled={settings.emailParams} onClick={() => handleToggle('emailParams')} />}
                    />
                    <SettingItem
                        icon={Bell}
                        title="Push Notifications"
                        description="Receive reminders on your device"
                        action={<Toggle enabled={settings.pushParams} onClick={() => handleToggle('pushParams')} />}
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
                        action={<Toggle enabled={settings.darkMode} onClick={() => handleToggle('darkMode')} />}
                    />
                    <SettingItem
                        icon={Volume2}
                        title="Sound Effects"
                        description="Play sounds for achievements"
                        action={<Toggle enabled={settings.sound} onClick={() => handleToggle('sound')} />}
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
                        <button
                            onClick={handleSignOut}
                            className="px-4 py-2 bg-error-light text-error rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-error hover:text-white transition-colors"
                        >
                            <LogOut size={16} />
                            Sign Out
                        </button>
                    </div>
                </Card>
            </main>
        </div>
    );
}
