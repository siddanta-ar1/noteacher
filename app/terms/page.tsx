"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-surface-base">
            <nav className="border-b border-border bg-surface px-6 py-4">
                <div className="max-w-4xl mx-auto flex items-center gap-4">
                    <Link
                        href="/home"
                        className="w-10 h-10 rounded-xl hover:bg-surface-raised flex items-center justify-center transition-colors text-ink-500 hover:text-primary"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-bold text-ink-900">NOTEacher</h1>
                        <Badge variant="teal">Terms of Service</Badge>
                    </div>
                </div>
            </nav>

            <main className="max-w-3xl mx-auto px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="prose prose-slate lg:prose-lg"
                >
                    <div className="mb-8">
                        <h1 className="text-4xl font-black text-ink-900 mb-2">Terms of Service</h1>
                        <p className="text-ink-500 font-medium">Last updated: February 2026</p>
                    </div>

                    <div className="space-y-8 text-ink-700">
                        <section>
                            <h3 className="text-xl font-bold text-ink-900 mb-3">1. Acceptance of Terms</h3>
                            <p>
                                By accessing and using NOTEacher ("Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold text-ink-900 mb-3">2. Description of Service</h3>
                            <p>
                                NOTEacher provides an interactive educational platform for learning complex topics through scrollytelling and simulation. We reserve the right to modify, suspend, or discontinue any part of the Service at any time.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold text-ink-900 mb-3">3. User Accounts</h3>
                            <p>
                                You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold text-ink-900 mb-3">4. Content and Conduct</h3>
                            <p>
                                All course content is owned by NOTEacher. You may not copy, distribute, or resell our materials without explicit permission. You agree not to use the Service for any illegal or unauthorized purpose.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold text-ink-900 mb-3">5. Disclaimer</h3>
                            <p>
                                The Service is provided "as is" without warranties of any kind. We do not guarantee that the Service will be uninterrupted or error-free.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold text-ink-900 mb-3">6. Contact</h3>
                            <p>
                                If you have any questions about these Terms, please contact us at support@noteacher.com.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
