"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
    ArrowLeft,
    Mail,
    Loader2,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";
import { Input } from "@/components/ui";
import { ROUTES } from "@/config";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        const email = formData.get("email") as string;

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/callback?next=/settings`,
            });

            if (error) throw error;

            setIsSuccess(true);
            toast.success("Reset link sent!");
        } catch (err: unknown) {
            const error = err as Error;
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-white overflow-hidden">
            {/* LEFT: Form Section */}
            <div className="flex flex-col justify-center px-8 sm:px-16 py-12 relative z-10">
                <Link
                    href={ROUTES.LOGIN}
                    className="absolute top-8 left-8 flex items-center gap-2 text-ink-400 hover:text-primary transition-colors group"
                >
                    <div className="w-8 h-8 rounded-full bg-surface-raised flex items-center justify-center group-hover:bg-primary/10">
                        <ArrowLeft size={16} />
                    </div>
                    <span className="font-bold text-sm">Back to Login</span>
                </Link>

                <div className="max-w-md mx-auto w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Header */}
                        <div className="mb-8">
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
                                <Mail size={32} />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black text-ink-900 mb-2">
                                Forgot Password?
                            </h1>
                            <p className="text-ink-500">
                                Don't worry! It happens. Please enter the email associated with your account.
                            </p>
                        </div>

                        {isSuccess ? (
                            <div className="bg-success-light text-success-dark border border-success/20 p-6 rounded-2xl flex flex-col items-center text-center">
                                <CheckCircle2 size={48} className="mb-4 text-success" />
                                <h3 className="text-lg font-bold mb-2">Check your email</h3>
                                <p className="text-sm opacity-90 mb-6">
                                    We have sent a password reset link to your email address.
                                </p>
                                <button
                                    onClick={() => setIsSuccess(false)}
                                    className="text-sm font-bold underline hover:text-success-darker"
                                >
                                    Try another email
                                </button>
                            </div>
                        ) : (
                            <form action={handleSubmit} className="space-y-6">
                                <Input
                                    name="email"
                                    type="email"
                                    label="Email"
                                    placeholder="you@example.com"
                                    icon={<Mail size={18} />}
                                    required
                                />

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg border-b-4 border-primary-hover active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    style={{ boxShadow: "var(--shadow-primary)" }}
                                >
                                    {isLoading ? (
                                        <Loader2 className="animate-spin" />
                                    ) : (
                                        "Send Reset Link"
                                    )}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* RIGHT: Visual Side (Reused from login for consistency) */}
            <div className="hidden lg:block bg-surface-raised relative overflow-hidden">
                {/* Simple pattern */}
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={400}
                        height={400}
                        className="opacity-5 grayscale blur-sm"
                    />
                </div>
            </div>
        </div>
    );
}
