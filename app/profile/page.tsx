"use client";

import { motion } from "framer-motion";
import {
  User,
  MapPin,
  Calendar,
  Edit2,
  Trophy,
  Zap,
  BookOpen,
  Github,
  Twitter
} from "lucide-react";
import Link from "next/link";
import { Avatar, Badge, Card, ProgressBar } from "@/components/ui";

const MOCK_PROFILE = {
  name: "John Doe",
  username: "@johndoe",
  bio: "Full-stack developer learning hardware engineering. Building cool stuff with Verilog and FPGAs.",
  location: "San Francisco, CA",
  joined: "January 2024",
  xp: 12450,
  level: 5,
  streak: 12,
  socials: {
    github: "github.com/johndoe",
    twitter: "twitter.com/johndoe"
  },
  achievements: [
    { icon: Zap, color: "text-power-orange", bg: "bg-power-orange-light", title: "Fast Learner", date: "2 days ago" },
    { icon: Trophy, color: "text-power-purple", bg: "bg-power-purple-light", title: "Course Master", date: "1 week ago" },
    { icon: BookOpen, color: "text-power-teal", bg: "bg-power-teal-light", title: "Bookworm", date: "2 weeks ago" },
  ]
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-surface-raised pb-20">
      {/* Header / Cover */}
      <div className="h-64 bg-gradient-to-r from-primary to-power-purple relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      </div>

      <main className="max-w-4xl mx-auto px-6 -mt-32 relative z-10">
        {/* Profile Card */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-border mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar */}
            <div className="relative -mt-20">
              <div className="p-2 bg-white rounded-[2.5rem] shadow-sm">
                <Avatar
                  name={MOCK_PROFILE.name}
                  size="xl"
                  className="w-32 h-32 text-3xl rounded-[2rem]"
                />
              </div>
              <div className="absolute bottom-2 right-2 bg-success text-white px-3 py-1 rounded-full text-xs font-black border-4 border-white">
                LVL {MOCK_PROFILE.level}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 w-full">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-black text-ink-900 mb-1">{MOCK_PROFILE.name}</h1>
                  <p className="text-ink-500 font-medium">{MOCK_PROFILE.username}</p>
                </div>
                <button className="px-5 py-2.5 border-2 border-border hover:border-primary hover:text-primary rounded-xl font-bold transition-all flex items-center gap-2 text-sm">
                  <Edit2 size={16} />
                  Edit Profile
                </button>
              </div>

              <p className="text-ink-700 leading-relaxed mb-6 max-w-2xl">
                {MOCK_PROFILE.bio}
              </p>

              <div className="flex flex-wrap gap-6 text-sm text-ink-500 mb-8">
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  {MOCK_PROFILE.location}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  Joined {MOCK_PROFILE.joined}
                </div>
                <div className="flex items-center gap-2">
                  <Github size={16} />
                  johndoe
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-surface-raised p-4 rounded-2xl text-center border border-border">
                  <div className="text-2xl font-black text-ink-900 mb-1">
                    {MOCK_PROFILE.xp.toLocaleString()}
                  </div>
                  <div className="text-xs font-bold text-ink-400 uppercase tracking-wider">
                    Total XP
                  </div>
                </div>
                <div className="bg-surface-raised p-4 rounded-2xl text-center border border-border">
                  <div className="text-2xl font-black text-ink-900 mb-1">
                    {MOCK_PROFILE.streak}
                  </div>
                  <div className="text-xs font-bold text-ink-400 uppercase tracking-wider">
                    Day Streak
                  </div>
                </div>
                <div className="bg-surface-raised p-4 rounded-2xl text-center border border-border">
                  <div className="text-2xl font-black text-ink-900 mb-1">
                    15
                  </div>
                  <div className="text-xs font-bold text-ink-400 uppercase tracking-wider">
                    Badges
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-8">
            {/* Current Progress */}
            <Card padding="lg" rounded="3xl">
              <h3 className="text-lg font-black text-ink-900 mb-6 flex items-center gap-2">
                <Zap className="text-primary" size={20} />
                Active Course
              </h3>
              <div className="bg-surface-raised p-6 rounded-2xl border border-border">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Badge variant="primary" className="mb-2">Hardware Design</Badge>
                    <h4 className="text-lg font-bold text-ink-900">Digital Logic & Architecture</h4>
                  </div>
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary font-black">
                    72%
                  </div>
                </div>
                <ProgressBar value={72} size="md" color="primary" showLabel />
                <div className="mt-4 flex justify-end">
                  <button className="text-sm font-bold text-primary hover:underline">
                    Resume Learning →
                  </button>
                </div>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card padding="lg" rounded="3xl">
              <h3 className="text-lg font-black text-ink-900 mb-6">Recent Activity</h3>
              <div className="space-y-6">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 bg-power-teal/10 rounded-full flex items-center justify-center shrink-0">
                      <div className="w-3 h-3 bg-power-teal rounded-full" />
                    </div>
                    <div className="pb-6 border-b border-border w-full last:border-0 last:pb-0">
                      <p className="text-ink-900 font-medium">
                        Completed lesson <span className="font-bold">Boolean Algebra Basics</span>
                      </p>
                      <p className="text-sm text-ink-400 mt-1">2 hours ago • +150 XP</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Achievements */}
            <Card padding="lg" rounded="3xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-ink-900">Achievements</h3>
                <Link href="#" className="text-xs font-bold text-primary hover:underline">View All</Link>
              </div>
              <div className="space-y-4">
                {MOCK_PROFILE.achievements.map((achievement, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${achievement.bg} rounded-xl flex items-center justify-center ${achievement.color}`}>
                      <achievement.icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-ink-900 text-sm">{achievement.title}</h4>
                      <p className="text-xs text-ink-400">{achievement.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Friends/Network */}
            <Card padding="lg" rounded="3xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-ink-900">Friends</h3>
                <Link href="#" className="text-xs font-bold text-primary hover:underline">View All</Link>
              </div>
              <div className="flex -space-x-3 overflow-hidden p-2">
                {[1, 2, 3, 4, 5].map((_, i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-surface-raised border-2 border-white flex items-center justify-center text-xs font-bold text-ink-500">
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full bg-surface-sunken border-2 border-white flex items-center justify-center text-xs font-bold text-ink-500">
                  +12
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
