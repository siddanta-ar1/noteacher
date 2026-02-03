"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui";

export default function PrivacyPage() {
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
                        <Badge variant="teal">Privacy Policy</Badge>
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
                        <h1 className="text-4xl font-black text-ink-900 mb-2">Privacy Policy</h1>
                        <p className="text-ink-500 font-medium">Last updated: February 2026</p>
                    </div>

                    <div className="space-y-8 text-ink-700">
                        <section>
                            <h3 className="text-xl font-bold text-ink-900 mb-3">1. Information We Collect</h3>
                            <p>
                                We collect information you provide directly to us (such as account details) and information automatically collected through your use of the Service (such as progress data and usage logs).
                            </p>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold text-ink-900 mb-3">2. How We Use Your Information</h3>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>To provide and improve our Service.</li>
                                <li>To personalize your learning experience.</li>
                                <li>To communicate with you about updates and offers.</li>
                                <li>To analyze usage patterns and fix bugs.</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold text-ink-900 mb-3">3. Data Sharing</h3>
                            <p>
                                We do not sell your personal data. We may share data with trusted service providers who help us operate our Service, subject to confidentiality obligations.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold text-ink-900 mb-3">4. Your Rights</h3>
                            <p>
                                Depending on your location, you may have rights regarding your data, including the right to access, correct, or delete your personal information.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold text-ink-900 mb-3">5. Security</h3>
                            <p>
                                We implement reasonable security measures to protect your data. However, no method of transmission over the Internet is 100% secure.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-xl font-bold text-ink-900 mb-3">6. Contact Us</h3>
                            <p>
                                If you have privacy-related concerns, please contact us at privacy@noteacher.com.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
