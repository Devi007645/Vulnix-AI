import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Bug,
  ChevronRight,
  Flame,
  GraduationCap,
  Lock,
  Play,
  Shield,
  Star,
  Swords,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { animate, motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

// ── Types ────────────────────────────────────────────────────────────────────
interface LearningPath {
  id: number;
  title: string;
  modules: number;
  progress: number;
  difficulty: "Beginner" | "Intermediate" | "Expert";
  nextLesson: string;
  xpEarned: number;
  icon: React.ReactNode;
  gradient: string;
}

interface Challenge {
  id: number;
  title: string;
  difficulty: "Medium" | "Hard" | "Expert";
  xp: number;
  category: string;
  description: string;
  locked?: boolean;
}

interface LeaderboardEntry {
  rank: number;
  username: string;
  level: number;
  xp: number;
  streak: number;
  initials: string;
  color: string;
  isCurrentUser?: boolean;
}

interface EarnedBadge {
  id: number;
  name: string;
  emoji: string;
  color: string;
  date: string;
}

// ── Static Data ───────────────────────────────────────────────────────────────
const learningPaths: LearningPath[] = [
  {
    id: 1,
    title: "Web Security Fundamentals",
    modules: 12,
    progress: 85,
    difficulty: "Beginner",
    nextLesson: "Advanced XSS Techniques",
    xpEarned: 3200,
    icon: <Shield className="w-5 h-5" />,
    gradient: "from-emerald-500/20 to-teal-500/10",
  },
  {
    id: 2,
    title: "Advanced Penetration Testing",
    modules: 20,
    progress: 42,
    difficulty: "Expert",
    nextLesson: "Buffer Overflow Exploits",
    xpEarned: 5100,
    icon: <Bug className="w-5 h-5" />,
    gradient: "from-orange-500/20 to-red-500/10",
  },
  {
    id: 3,
    title: "Bug Bounty Mastery",
    modules: 15,
    progress: 65,
    difficulty: "Intermediate",
    nextLesson: "IDOR Vulnerabilities",
    xpEarned: 4800,
    icon: <Target className="w-5 h-5" />,
    gradient: "from-purple-500/20 to-indigo-500/10",
  },
];

const challenges: Challenge[] = [
  {
    id: 1,
    title: "XSS in React Apps",
    difficulty: "Medium",
    xp: 150,
    category: "Web",
    description: "Find and exploit stored XSS vulnerabilities in a React SPA.",
  },
  {
    id: 2,
    title: "JWT Authentication Bypass",
    difficulty: "Hard",
    xp: 300,
    category: "API Security",
    description: "Forge JWT tokens and escalate privileges in a REST API.",
  },
  {
    id: 3,
    title: "Docker Escape",
    difficulty: "Expert",
    xp: 500,
    category: "Containers",
    description: "Break out of a misconfigured Docker container to host.",
    locked: true,
  },
  {
    id: 4,
    title: "SSRF via PDF Generator",
    difficulty: "Hard",
    xp: 250,
    category: "Web",
    description:
      "Exploit SSRF in a PDF rendering service to hit internal endpoints.",
  },
];

const leaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    username: "CipherGhost",
    level: 28,
    xp: 24500,
    streak: 34,
    initials: "CG",
    color: "#F59E0B",
  },
  {
    rank: 2,
    username: "ZeroD4y",
    level: 25,
    xp: 21200,
    streak: 21,
    initials: "ZD",
    color: "#94A3B8",
  },
  {
    rank: 3,
    username: "NullByte",
    level: 22,
    xp: 18900,
    streak: 15,
    initials: "NB",
    color: "#CD7F32",
  },
  {
    rank: 4,
    username: "HexShadow",
    level: 19,
    xp: 15400,
    streak: 8,
    initials: "HS",
    color: "#6366F1",
  },
  {
    rank: 5,
    username: "AlexHunter",
    level: 14,
    xp: 8450,
    streak: 12,
    initials: "AX",
    color: "#06B6D4",
    isCurrentUser: true,
  },
];

const earnedBadges: EarnedBadge[] = [
  {
    id: 1,
    name: "Shield Master",
    emoji: "🛡️",
    color: "from-cyan-500/30 to-blue-500/20",
    date: "Apr 12",
  },
  {
    id: 2,
    name: "XSS Hunter",
    emoji: "🎯",
    color: "from-orange-500/30 to-red-500/20",
    date: "Apr 28",
  },
  {
    id: 3,
    name: "SQL Slayer",
    emoji: "💉",
    color: "from-purple-500/30 to-pink-500/20",
    date: "May 3",
  },
  {
    id: 4,
    name: "Recon Pro",
    emoji: "🔍",
    color: "from-emerald-500/30 to-teal-500/20",
    date: "May 7",
  },
  {
    id: 5,
    name: "CTF Champion",
    emoji: "🏆",
    color: "from-yellow-500/30 to-amber-500/20",
    date: "May 10",
  },
  {
    id: 6,
    name: "Speed Hacker",
    emoji: "⚡",
    color: "from-indigo-500/30 to-violet-500/20",
    date: "May 13",
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function difficultyColor(d: string) {
  if (d === "Beginner")
    return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
  if (d === "Intermediate")
    return "text-amber-400 border-amber-500/30 bg-amber-500/10";
  if (d === "Hard")
    return "text-orange-400 border-orange-500/30 bg-orange-500/10";
  if (d === "Expert") return "text-red-400 border-red-500/30 bg-red-500/10";
  return "text-muted-foreground";
}

function progressColor(d: string) {
  if (d === "Beginner") return "#10B981";
  if (d === "Intermediate") return "#F59E0B";
  return "#EF4444";
}

function rankMedal(rank: number) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
}

// ── Animated XP Bar ──────────────────────────────────────────────────────────
function AnimatedXPBar({ value, max }: { value: number; max: number }) {
  const [width, setWidth] = useState(0);
  const pct = Math.round((value / max) * 100);

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 300);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div className="flex items-center gap-3 flex-1">
      <div className="relative flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: "linear-gradient(90deg, #06B6D4, #8B5CF6)" }}
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        {/* shimmer */}
        <motion.div
          className="absolute inset-y-0 w-12 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
          }}
          animate={{ left: ["-10%", "110%"] }}
          transition={{
            duration: 2.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
            delay: 1.5,
          }}
        />
      </div>
      <span className="text-xs font-mono text-cyan-400 whitespace-nowrap">
        {value.toLocaleString()} / {max.toLocaleString()} XP
      </span>
    </div>
  );
}

// ── Countdown Timer ───────────────────────────────────────────────────────────
function Countdown() {
  const [time, setTime] = useState({ h: 14, m: 23, s: 11 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        let { h, m, s } = prev;
        s -= 1;
        if (s < 0) {
          s = 59;
          m -= 1;
        }
        if (m < 0) {
          m = 59;
          h -= 1;
        }
        if (h < 0) {
          h = 23;
          m = 59;
          s = 59;
        }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <span className="font-mono text-amber-400 text-sm">
      {pad(time.h)}:{pad(time.m)}:{pad(time.s)}
    </span>
  );
}

// ── Challenge Card ────────────────────────────────────────────────────────────
function ChallengeCard({
  challenge,
  index,
}: { challenge: Challenge; index: number }) {
  return (
    <motion.div
      data-ocid={`challenge.item.${index + 1}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }}
      className={`relative rounded-xl p-4 border transition-smooth group ${
        challenge.locked
          ? "glass opacity-50 border-white/5"
          : "glass border-white/8 hover:border-cyan-500/30 hover-lift"
      }`}
      style={{
        background: challenge.locked ? undefined : undefined,
      }}
    >
      {/* Gradient border on hover (not locked) */}
      {!challenge.locked && (
        <div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-smooth pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(6,182,212,0.08), rgba(139,92,246,0.05))",
          }}
        />
      )}

      <div className="flex items-start justify-between mb-2 gap-2">
        <div className="flex gap-2 flex-wrap">
          <span
            className="text-xs px-2 py-0.5 rounded-full border font-mono"
            style={{
              color: "#06B6D4",
              borderColor: "rgba(6,182,212,0.3)",
              background: "rgba(6,182,212,0.1)",
            }}
          >
            {challenge.category}
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full border font-medium ${difficultyColor(challenge.difficulty)}`}
          >
            {challenge.difficulty}
          </span>
        </div>
        <span className="flex items-center gap-1 text-xs font-bold text-amber-400 whitespace-nowrap">
          <Zap className="w-3 h-3" />+{challenge.xp} XP
        </span>
      </div>

      <h4 className="font-semibold text-sm text-foreground mb-1">
        {challenge.title}
      </h4>
      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
        {challenge.description}
      </p>

      {challenge.locked ? (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Lock className="w-3.5 h-3.5" />
          <span>Locked — Complete Expert prerequisites</span>
        </div>
      ) : (
        <Button
          data-ocid={`challenge.start_button.${index + 1}`}
          size="sm"
          variant="outline"
          className="w-full text-xs border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400/50 transition-smooth"
        >
          <Play className="w-3 h-3 mr-1.5" /> Start Challenge
        </Button>
      )}
    </motion.div>
  );
}

// ── Learning Path Card ────────────────────────────────────────────────────────
function PathCard({ path, index }: { path: LearningPath; index: number }) {
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setBarWidth(path.progress), 400 + index * 100);
    return () => clearTimeout(t);
  }, [path.progress, index]);

  return (
    <motion.div
      data-ocid={`learning_path.item.${index + 1}`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.1 }}
      className="glass rounded-xl overflow-hidden border border-white/8 hover:border-white/15 hover-lift group flex flex-col"
    >
      {/* Gradient header */}
      <div
        className={`bg-gradient-to-r ${path.gradient} border-b border-white/5 px-5 py-4 flex items-center justify-between`}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            {path.icon}
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-mono">
              {path.modules} modules
            </p>
            <span
              className={`text-xs px-2 py-0.5 rounded-full border font-medium ${difficultyColor(path.difficulty)}`}
            >
              {path.difficulty}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">XP Earned</p>
          <p className="text-sm font-bold text-amber-400">
            {path.xpEarned.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        <h3 className="font-semibold text-foreground">{path.title}</h3>

        {/* Progress */}
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>Progress</span>
            <span
              className="font-mono font-bold"
              style={{ color: progressColor(path.difficulty) }}
            >
              {path.progress}%
            </span>
          </div>
          <div className="relative h-1.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{ background: progressColor(path.difficulty) }}
              initial={{ width: 0 }}
              animate={{ width: `${barWidth}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Next lesson */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span>
            Next: <span className="text-foreground">{path.nextLesson}</span>
          </span>
        </div>

        <Button
          data-ocid={`learning_path.continue_button.${index + 1}`}
          size="sm"
          className="mt-auto w-full text-xs transition-smooth"
          style={{
            background: "linear-gradient(135deg, #06B6D4, #8B5CF6)",
            color: "#000",
          }}
        >
          Continue <ChevronRight className="w-3 h-3 ml-1" />
        </Button>
      </div>
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function LearningPage() {
  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      {/* ── Section 1: Page Header ───────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        data-ocid="learning.page"
        className="space-y-5"
      >
        {/* Title */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center glow-cyan"
            style={{ background: "linear-gradient(135deg, #06B6D4, #8B5CF6)" }}
          >
            <GraduationCap className="w-5 h-5 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gradient-cyan">
                Learning Arena
              </h1>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-sm text-muted-foreground">
              Gamified cybersecurity training with AI mentor guidance
            </p>
          </div>
        </div>

        {/* Player Stats Bar */}
        <div className="glass rounded-xl px-5 py-4 border border-white/8">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Avatar */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-black glow-cyan flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #06B6D4, #8B5CF6)",
              }}
            >
              AX
            </div>

            {/* Level + Name */}
            <div className="flex-shrink-0">
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-md"
                  style={{
                    background: "rgba(139,92,246,0.2)",
                    color: "#A78BFA",
                    border: "1px solid rgba(139,92,246,0.4)",
                  }}
                >
                  Lv. 14
                </span>
                <span className="font-semibold text-sm text-foreground">
                  AlexHunter
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Penetration Tester
              </p>
            </div>

            {/* XP Bar */}
            <AnimatedXPBar value={1250} max={2000} />

            {/* Streak */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="text-base">🔥</span>
              <div className="text-right">
                <p className="text-xs font-bold text-orange-400">
                  12 day streak
                </p>
                <p className="text-xs text-muted-foreground">Keep going!</p>
              </div>
            </div>

            {/* Total XP */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Zap className="w-4 h-4 text-amber-400" />
              <div>
                <p className="text-xs font-bold text-amber-400">8,450 XP</p>
                <p className="text-xs text-muted-foreground">Total earned</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Section 2: Daily Challenge ───────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        data-ocid="daily_challenge.card"
        className="relative rounded-2xl overflow-hidden border p-6"
        style={{
          background:
            "linear-gradient(135deg, rgba(245,158,11,0.08), rgba(239,68,68,0.05), rgba(17,17,17,0.9))",
          borderColor: "rgba(245,158,11,0.35)",
          boxShadow:
            "0 0 40px rgba(245,158,11,0.12), inset 0 0 60px rgba(245,158,11,0.03)",
        }}
      >
        {/* Pulsing border overlay */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ border: "1px solid rgba(245,158,11,0.5)" }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 2.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span
                className="text-xs font-bold px-3 py-1 rounded-full"
                style={{
                  background: "rgba(245,158,11,0.15)",
                  color: "#F59E0B",
                  border: "1px solid rgba(245,158,11,0.4)",
                }}
              >
                ⚡ DAILY CHALLENGE
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                Resets in <Countdown />
              </span>
            </div>

            <h2 className="text-xl font-bold text-foreground mb-2">
              Advanced SQL Injection — Time-Based Blind
            </h2>
            <p className="text-sm text-muted-foreground mb-4 max-w-2xl">
              Exploit a login form vulnerable to time-based blind SQL injection.
              Extract the admin password hash without receiving any direct query
              output.
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              <span
                className={`text-xs px-2.5 py-1 rounded-full border font-bold ${difficultyColor("Hard")}`}
              >
                HARD
              </span>
              <span
                className="text-xs px-2.5 py-1 rounded-full border"
                style={{
                  color: "#06B6D4",
                  borderColor: "rgba(6,182,212,0.3)",
                  background: "rgba(6,182,212,0.1)",
                }}
              >
                Web Exploitation
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-amber-400">
                <Zap className="w-3.5 h-3.5" /> +250 XP
              </span>
            </div>
          </div>

          <div className="md:w-56 flex-shrink-0">
            <Button
              data-ocid="daily_challenge.accept_button"
              className="w-full font-bold transition-smooth"
              style={{
                background: "linear-gradient(135deg, #06B6D4, #8B5CF6)",
                color: "#000",
                boxShadow: "0 0 20px rgba(6,182,212,0.3)",
              }}
            >
              <Swords className="w-4 h-4 mr-2" /> Accept Challenge
            </Button>
          </div>
        </div>
      </motion.div>

      {/* ── Section 3: Learning Paths ────────────────────────────────────── */}
      <section data-ocid="learning_paths.section">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
            Learning Paths
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {learningPaths.map((path, i) => (
            <PathCard key={path.id} path={path} index={i} />
          ))}
        </div>
      </section>

      {/* ── Section 4: Two Columns ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-[55%_45%] gap-6">
        {/* LEFT: Active Challenges 2x2 */}
        <section data-ocid="challenges.section">
          <div className="flex items-center gap-2 mb-4">
            <Swords className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
              Active Challenges
            </h2>
            <span className="text-xs text-muted-foreground ml-auto">
              4 available
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {challenges.map((ch, i) => (
              <ChallengeCard key={ch.id} challenge={ch} index={i} />
            ))}
          </div>
        </section>

        {/* RIGHT: Leaderboard + Badges */}
        <div className="space-y-4">
          {/* Leaderboard */}
          <motion.section
            data-ocid="leaderboard.section"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-xl border border-white/8 overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-foreground">Leaderboard</h3>
              <span className="ml-auto text-xs text-muted-foreground">
                This week
              </span>
            </div>

            <div className="divide-y divide-white/5">
              {leaderboard.map((entry, i) => (
                <motion.div
                  key={entry.rank}
                  data-ocid={`leaderboard.item.${entry.rank}`}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.07 }}
                  className={`flex items-center gap-3 px-4 py-3 transition-smooth ${
                    entry.isCurrentUser
                      ? "bg-cyan-500/8 border-l-2 border-cyan-400/60"
                      : "hover:bg-white/3"
                  }`}
                >
                  {/* Rank */}
                  <span
                    className="w-8 text-center text-sm font-bold flex-shrink-0"
                    style={{ color: entry.rank <= 3 ? undefined : "#6B7280" }}
                  >
                    {rankMedal(entry.rank)}
                  </span>

                  {/* Avatar */}
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-black flex-shrink-0"
                    style={{ background: entry.color }}
                  >
                    {entry.initials}
                  </div>

                  {/* Name + level */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p
                        className={`text-sm font-semibold truncate ${
                          entry.isCurrentUser
                            ? "text-cyan-400"
                            : "text-foreground"
                        }`}
                      >
                        {entry.username}
                      </p>
                      {entry.isCurrentUser && (
                        <span className="text-xs text-cyan-500/70">(You)</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Lv.{entry.level}
                    </p>
                  </div>

                  {/* XP */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-bold text-amber-400">
                      {entry.xp.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center justify-end gap-0.5">
                      <Flame className="w-2.5 h-2.5 text-orange-400" />
                      {entry.streak}d
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Badge Showcase */}
          <motion.section
            data-ocid="badges.section"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 }}
            className="glass rounded-xl border border-white/8 overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
              <Star className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-foreground">
                Earned Badges
              </h3>
              <span className="ml-auto text-xs text-muted-foreground">
                6 / 24
              </span>
            </div>

            <div className="p-4 grid grid-cols-3 gap-3">
              {earnedBadges.map((badge, i) => (
                <motion.div
                  key={badge.id}
                  data-ocid={`badge.item.${i + 1}`}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.5 + i * 0.06,
                    type: "spring",
                    stiffness: 200,
                  }}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-white/8 hover:border-white/15 transition-smooth hover-lift cursor-default group"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                >
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center text-2xl bg-gradient-to-br ${badge.color} group-hover:scale-110 transition-smooth`}
                    style={{ boxShadow: "0 0 12px rgba(255,255,255,0.08)" }}
                  >
                    {badge.emoji}
                  </div>
                  <p className="text-xs font-semibold text-foreground text-center leading-tight">
                    {badge.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{badge.date}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
