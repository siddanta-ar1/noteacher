"use client";

import { motion } from "framer-motion";
import {
    HelpCircle,
    MessageCircle,
    BookOpen,
    Mail,
    ExternalLink,
    ChevronLeft,
    ChevronRight,
    Search,
    Zap,
    FileQuestion,
    Users,
    Heart
} from "lucide-react";
import Link from "next/link";
import { Card, Badge } from "@/components/ui";

const faqs = [
    {
        question: "How do I track my progress?",
        answer: "Your progress is automatically saved as you complete lessons. Visit your Dashboard to see overall progress and the Course Map for detailed lesson completion."
    },
    {
        question: "Can I download lessons for offline use?",
        answer: "Offline access is coming soon as part of our Pro plan. Stay tuned for updates!"
    },
    {
        question: "How does the AI tutor work?",
        answer: "Our AI understands the context of your current lesson and can answer questions, explain concepts, or help debug your logic without giving away answers."
    },
    {
        question: "How do I reset my password?",
        answer: "Click the 'Forgot Password' link on the login page, enter your email, and follow the instructions sent to your inbox."
    },
];

const resources = [
    { icon: BookOpen, title: "Documentation", desc: "Browse our guides", href: "#" },
    { icon: MessageCircle, title: "Community", desc: "Join Discord", href: "#" },
    { icon: Mail, title: "Email Support", desc: "help@noteacher.com", href: "mailto:help@noteacher.com" },
];

export default function HelpPage() {
    return (
        <div className="min-h-screen bg-surface-raised pb-20">
            {/* Header */}
            <header className="bg-primary pt-16 pb-24 px-6 rounded-b-[3rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-power-purple/20 rounded-full blur-3xl -mr-48 -mt-48" />

                <div className="max-w-3xl mx-auto relative z-10">
                    <Link
                        href="/home"
                        className="flex items-center gap-2 text-white/70 hover:text-white transition-colors font-bold text-sm mb-8"
                    >
                        <ChevronLeft size={18} />
                        <span>Back to Dashboard</span>
                    </Link>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                            <HelpCircle className="text-white" size={28} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-white">Help & Support</h1>
                            <p className="text-white/70">We're here to help you succeed</p>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="bg-white p-2 rounded-2xl shadow-xl flex items-center max-w-xl">
                        <div className="w-12 h-12 flex items-center justify-center text-ink-400">
                            <Search size={22} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search for help..."
                            className="flex-1 bg-transparent border-none outline-none text-lg font-medium text-ink-900 placeholder:text-ink-400 h-12"
                        />
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-3xl mx-auto px-6 -mt-8 space-y-8 relative z-20">
                {/* Quick Links */}
                <div className="grid md:grid-cols-3 gap-4">
                    {resources.map((resource, i) => (
                        <motion.a
                            key={i}
                            href={resource.href}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-5 rounded-2xl border border-border hover:border-primary hover:shadow-lg transition-all group flex items-center gap-4"
                        >
                            <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <resource.icon size={22} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-ink-900">{resource.title}</h3>
                                <p className="text-sm text-ink-400">{resource.desc}</p>
                            </div>
                            <ExternalLink size={16} className="text-ink-300 group-hover:text-primary" />
                        </motion.a>
                    ))}
                </div>

                {/* FAQ Section */}
                <Card padding="lg" rounded="3xl">
                    <div className="flex items-center gap-3 mb-6">
                        <FileQuestion className="text-power-purple" size={24} />
                        <h2 className="text-xl font-black text-ink-900">Frequently Asked Questions</h2>
                    </div>
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <details
                                key={i}
                                className="group bg-surface-raised rounded-xl overflow-hidden"
                            >
                                <summary className="p-4 cursor-pointer font-bold text-ink-900 hover:text-primary transition-colors flex items-center justify-between">
                                    {faq.question}
                                    <ChevronRight className="text-ink-400 group-open:rotate-90 transition-transform" size={18} />
                                </summary>
                                <div className="px-4 pb-4 text-ink-500 leading-relaxed">
                                    {faq.answer}
                                </div>
                            </details>
                        ))}
                    </div>
                </Card>

                {/* Contact Section */}
                <Card padding="lg" rounded="3xl" className="bg-gradient-to-br from-power-teal/10 to-power-purple/10 border-0">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <Heart className="text-power-purple" size={28} />
                        </div>
                        <h3 className="text-xl font-black text-ink-900 mb-2">Still need help?</h3>
                        <p className="text-ink-500 mb-6">Our team typically responds within 24 hours</p>
                        <button className="px-6 py-3 bg-primary text-white rounded-xl font-bold flex items-center gap-2 mx-auto hover:shadow-lg transition-shadow" style={{ boxShadow: "var(--shadow-primary)" }}>
                            <MessageCircle size={18} />
                            Contact Support
                        </button>
                    </div>
                </Card>
            </main>
        </div>
    );
}
