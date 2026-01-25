"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase"; // Import the singleton directly
import { useRouter } from "next/navigation";
import { User, Save, ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
// import { toast } from "sonner";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  // Note: We use the 'supabase' singleton imported above

  useEffect(() => {
    const getProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUserId(user.id);

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      if (profile) setFullName(profile.full_name || "");
      setLoading(false);
    };

    getProfile();
  }, [router]);

  const handleSave = async () => {
    if (!userId || !fullName.trim()) return;
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, updated_at: new Date().toISOString() })
      .eq("id", userId);

    if (!error) {
      // toast.success("Profile updated");
      router.refresh();
      setTimeout(() => router.push("/home"), 500);
    } else {
      console.error(error);
      // toast.error("Failed to update profile");
    }
    setSaving(false);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-navy" />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link
          href="/home"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-navy font-bold text-sm mb-8 transition-colors"
        >
          <ChevronLeft size={16} /> Back to Dashboard
        </Link>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border-2 border-slate-100">
          <div className="w-20 h-20 bg-navy rounded-full flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-navy/20">
            <User size={32} />
          </div>

          <h1 className="text-2xl font-black text-center text-slate-900 mb-2">
            Cadet Identity
          </h1>
          <p className="text-slate-400 text-center text-sm font-medium mb-8">
            Update your credentials for the leaderboard.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-4">
                Full Name / Callsign
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full h-14 rounded-2xl bg-slate-50 border-2 border-slate-100 px-6 font-bold text-slate-700 outline-none focus:border-navy focus:bg-white transition-all"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving || !fullName.trim()}
              className="w-full h-14 bg-navy text-white rounded-2xl font-black text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100"
            >
              {saving ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <Save size={18} /> Save & Continue
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
