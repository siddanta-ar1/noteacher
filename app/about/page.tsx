"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Users, Zap, Award } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge, Card } from "@/components/ui";

export default function AboutPage() {
    const team = [
        { name: "Siddanta Sodari", role: "Frontend Architect", color: "bg-power-teal" },
        { name: "Rajib Sedai", role: "Backend Engineer", color: "bg-power-purple" },
        { name: "Rise Thapa", role: "Product Designer", color: "bg-power-orange" },
    ];

    return (
        <div className="min-h-screen bg-surface-base pb-20">
            <nav className="border-b border-border bg-white px-6 py-4 sticky top-0 z-50">
                <div className="max-w-4xl mx-auto flex items-center gap-4">
                    <Link
                        href="/home"
                        className="w-10 h-10 rounded-xl hover:bg-surface-raised flex items-center justify-center transition-colors text-ink-500 hover:text-primary"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-bold text-ink-900">NOTEacher</h1>
                        <Badge variant="teal">About Us</Badge>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-12">
                {/* Mission Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <Badge variant="primary" className="mb-4 text-xs font-black uppercase tracking-wider">
                        Our Mission
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-black text-ink-900 mb-6 leading-tight">
                        Empowering the next generation<br />of <span className="text-primary">engineers</span>.
                    </h1>
                    <p className="text-xl text-ink-500 max-w-2xl mx-auto">
                        We believe that learning complex engineering concepts shouldn't be boring.
                        We combine storytelling, interactivity, and AI to create an immersive learning experience.
                    </p>
                </motion.div>

                {/* Team Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-black text-ink-900 flex items-center gap-3">
                            <Users className="text-primary" size={28} />
                            Meet the Team
                        </h2>
                        <Badge variant="default">The Visionaries</Badge>
                    </div>

                    <Card padding="none" rounded="3xl" className="overflow-hidden mb-12 border-none shadow-2xl">
                        <div className="aspect-video relative w-full">
                            {/* Placeholder for the team image user provided */}
                            <Image
                                src="/team.jpg"
                                alt="The NOTEacher Team"
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-8">
                                <h3 className="text-3xl font-black text-white mb-2">The BOSC Team</h3>
                                <p className="text-white/80 font-medium">Birendra Multiple Campus</p>
                            </div>
                        </div>
                    </Card>

                    <div className="grid md:grid-cols-3 gap-6">
                        {team.map((member, i) => (
                            <motion.div
                                key={member.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + i * 0.1 }}
                                className="bg-white p-6 rounded-[2rem] border border-border hover:border-primary/50 transition-colors shadow-lg"
                            >
                                <div className={`w-12 h-12 ${member.color} rounded-2xl flex items-center justify-center text-white mb-4 shadow-md`}>
                                    <Award size={20} />
                                </div>
                                <h3 className="text-lg font-black text-ink-900 mb-1">{member.name}</h3>
                                <p className="text-sm font-bold text-ink-400 uppercase tracking-wider">{member.role}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
