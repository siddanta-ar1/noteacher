// app/home/DashboardClient.tsx
"use client";

import { motion } from "framer-motion";
import {
  Play,
  BookOpen,
  Trophy,
  Star,
  ChevronRight,
  Zap,
  CheckCircle,
  Map as MapIcon,
  Sparkles,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { ProgressBar, Avatar } from "@/components/ui";

type DashboardProps = {
  profile: { xp: number; name: string; streak: number; avatar_url?: string | null };
  activeMission: {
    title: string;
    chapter: string;
    progress: number;
    id: string;
    courseId?: string;
  } | null;
  courses: Array<{
    id: string;
    title: string;
    progress: number;
    color: string;
    iconName: string;
    startNodeId?: string;
  }>;
};

const IconMap: Record<string, React.ElementType> = { Zap, BookOpen, Trophy, Star };

// Get greeting based on time
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardClient({
  profile,
  activeMission,
  courses,
}: DashboardProps) {
  const greeting = getGreeting();
  const firstName = profile.name?.split(" ")[0] || "Learner";

  return (
    <div className="min-h-screen bg-surface-raised">
      {/* HEADER */}
      <header className="bg-primary pt-8 pb-28 px-6 rounded-b-[3rem] relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-power-purple/20 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-power-teal/20 rounded-full blur-3xl -ml-32 -mb-32" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex justify-between items-start">
            <Link href="/settings" className="group">
              <div className="flex items-center gap-4">
                <Avatar
                  name={profile.name}
                  src={profile.avatar_url || undefined}
                  size="lg"
                />
                <div>
                  <p className="text-white/70 text-sm font-medium">
                    {greeting},
                  </p>
                  <h1 className="text-white text-2xl font-black group-hover:text-power-teal transition-colors">
                    {firstName}
                  </h1>
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl flex items-center gap-2 border border-white/20"
              >
                <Zap className="w-4 h-4 text-power-orange fill-power-orange" />
                <span className="text-white font-bold text-sm">
                  {profile.streak} day{profile.streak !== 1 ? 's' : ''}
                </span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl flex items-center gap-2 border border-white/20"
              >
                <Star className="w-4 h-4 text-power-teal fill-power-teal" />
                <span className="text-white font-bold text-sm">
                  {profile.xp.toLocaleString()} XP
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* ACTIVE MISSION CARD - Floating */}
      <div className="max-w-5xl mx-auto px-6 -mt-16 relative z-20">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-[2rem] p-6 md:p-8 shadow-xl border border-border"
        >
          {activeMission ? (
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Icon */}
              <div className="w-20 h-20 bg-power-teal/10 rounded-[1.5rem] flex items-center justify-center shrink-0 border border-power-teal/20">
                <Sparkles className="w-10 h-10 text-power-teal fill-power-teal/20" />
              </div>

              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-power-teal animate-pulse" />
                  <span className="text-power-teal font-bold text-xs uppercase tracking-wider">
                    Continue Learning
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-black text-ink-900 mb-3">
                  {activeMission.title}
                </h2>
                <div className="flex items-center gap-4 justify-center md:justify-start">
                  <ProgressBar
                    value={activeMission.progress}
                    color="teal"
                    size="md"
                    className="max-w-[200px] flex-1"
                  />
                  <span className="text-sm font-black text-ink-900">
                    {activeMission.progress}%
                  </span>
                </div>
              </div>

              {/* Resume Button */}
              <Link href={`/lesson/${activeMission.id}`}>
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-primary text-white rounded-2xl font-bold border-b-4 border-primary-hover active:translate-y-1 active:border-b-0 transition-all shadow-lg flex items-center gap-2"
                  style={{ boxShadow: "var(--shadow-primary)" }}
                >
                  Resume
                  <Play className="w-5 h-5 fill-white" />
                </motion.button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center py-6">
              <div className="w-16 h-16 bg-surface-sunken rounded-full flex items-center justify-center mb-4">
                <Trophy className="text-power-orange w-8 h-8" />
              </div>
              <h2 className="text-xl font-black text-ink-900 mb-2">
                Ready for a New Challenge?
              </h2>
              <p className="text-ink-500 font-medium mb-6">
                Select a course below to begin your journey.
              </p>
              <Link href="/courses">
                <button className="px-6 py-3 bg-primary text-white rounded-xl font-bold flex items-center gap-2">
                  Browse Courses
                  <ChevronRight size={18} />
                </button>
              </Link>
            </div>
          )}
        </motion.div>
      </div>

      {/* COURSE GRID */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-black text-ink-900 flex items-center gap-3">
            <MapIcon className="text-ink-300" size={24} />
            Your Roadmaps
          </h3>
          <Link
            href="/courses"
            className="text-sm font-bold text-primary hover:underline flex items-center gap-1"
          >
            View All
            <ChevronRight size={16} />
          </Link>
        </div>

        {courses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => {
              const Icon = IconMap[course.iconName] || BookOpen;
              const isCompleted = course.progress >= 100;

              // Map legacy color strings to tailwind text/bg classes if needed, 
              // or just rely on dynamic classes if they are standard format.
              // Assuming course.color is like "bg-power-teal". 
              // We want to transform "bg-power-teal" -> "bg-power-teal/10 text-power-teal"
              // Only works if course.color is exactly "bg-power-teal" or similar.

              const colorBase = course.color.replace("bg-", ""); // e.g., "power-teal"
              const iconStyle = {
                backgroundColor: `var(--${colorBase}-10, rgba(0,0,0,0.05))`, // Fallback/hack
                color: `var(--${colorBase}, currentColor)`
              };

              // Actually, since we use tailwind classes, let's just do manual mapping for known colors if possible, 
              // or use inline styles with opacity.
              // A safer way without complex parsing: just use opacity utility if we can,
              // but we need to change text color too.

              // Let's assume standard colors for now and use a simpler approach:
              // Just use bg-surface-raised and text-ink-500 if generic, or specific logic.
              // For "professional" look, let's treat them uniformly or use a map.

              const textColorClass = course.color.replace("bg-", "text-"); // e.g. text-power-teal

              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/course/${course.id}`}>
                    <motion.div
                      whileHover={{ y: -4, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.1)" }}
                      className="bg-white border-2 border-border p-6 rounded-[1.5rem] hover:border-primary transition-all cursor-pointer h-full flex flex-col group"
                    >
                      {/* Icon & Badge */}
                      <div className="flex justify-between items-start mb-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${course.color.replace('bg-', 'bg-')}/10 ${course.color.replace('bg-', 'text-')}`}
                          // Note: Tailwind arbitrary values with dynamic strings might not work JIT. 
                          // Better to use safe list or style prop. 
                          // Let's use style for reliability with dynamic colors.
                          style={{
                            backgroundColor: `var(--${course.color.replace('bg-', '')})22`, // roughly 13% opacity hex
                            color: `var(--${course.color.replace('bg-', '')})`
                          }}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        {isCompleted && (
                          <span className="bg-success-light text-success text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                            <CheckCircle size={12} />
                            Complete
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <h4 className="text-lg font-black text-ink-900 mb-2 group-hover:text-primary transition-colors line-clamp-1">
                        {course.title}
                      </h4>

                      <div className="flex-1" />

                      {/* Progress */}
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-ink-400">
                            {isCompleted ? "Mastered" : `${course.progress}% complete`}
                          </span>
                          <ChevronRight className="w-4 h-4 text-ink-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                        <ProgressBar
                          value={course.progress}
                          color={isCompleted ? "success" : "primary"}
                          size="sm"
                          animated={false}
                        />
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-border">
            <div className="w-16 h-16 bg-surface-sunken rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="text-ink-400 w-8 h-8" />
            </div>
            <p className="font-bold text-ink-500 mb-4">
              No courses yet. Let's get started!
            </p>
            <Link href="/courses">
              <button className="px-6 py-3 bg-primary text-white rounded-xl font-bold">
                Browse Courses
              </button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
