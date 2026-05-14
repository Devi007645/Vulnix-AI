import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  Bot,
  Check,
  ChevronDown,
  ChevronRight,
  Code2,
  ExternalLink,
  Eye,
  FileCode2,
  GitBranch,
  GitPullRequest,
  Plug,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Star,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Repository {
  id: string;
  name: string;
  language: "Python" | "TypeScript" | "Go";
  score: number;
  vulns: number;
  lastScan: string;
  branch: string;
  stars: number;
}

interface Vulnerability {
  id: string;
  title: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  file: string;
  line: number;
  codeLines: string[];
  aiComment: string;
  resolved: boolean;
}

// ── Mock Data ─────────────────────────────────────────────────────────────────
const REPOS: Repository[] = [
  {
    id: "1",
    name: "nexacorp/api-backend",
    language: "Python",
    score: 62,
    vulns: 12,
    lastScan: "1h ago",
    branch: "main",
    stars: 234,
  },
  {
    id: "2",
    name: "helixsec/frontend",
    language: "TypeScript",
    score: 88,
    vulns: 4,
    lastScan: "3h ago",
    branch: "develop",
    stars: 89,
  },
  {
    id: "3",
    name: "orbita/mobile-api",
    language: "Go",
    score: 95,
    vulns: 2,
    lastScan: "Yesterday",
    branch: "main",
    stars: 156,
  },
];

const VULNS: Vulnerability[] = [
  {
    id: "v1",
    title: "SQL Injection",
    severity: "Critical",
    file: "src/api/users.py",
    line: 47,
    codeLines: [
      "# VULNERABLE CODE",
      'query = f"SELECT * FROM users WHERE id = {user_id}"',
      "cursor.execute(query)",
    ],
    aiComment:
      "⚠️ Direct string interpolation in SQL query. Use parameterized queries: cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))",
    resolved: false,
  },
  {
    id: "v2",
    title: "Hardcoded Secret",
    severity: "High",
    file: "src/config/settings.py",
    line: 12,
    codeLines: [
      'SECRET_KEY = "sk-prod-abc123xyz789"',
      'DATABASE_URL = "postgres://admin:password123@db:5432/prod"',
    ],
    aiComment:
      "🔑 Hardcoded credentials detected. Move to environment variables or a secrets manager immediately.",
    resolved: false,
  },
  {
    id: "v3",
    title: "Path Traversal",
    severity: "High",
    file: "src/api/files.py",
    line: 89,
    codeLines: [
      "file_path = os.path.join(BASE_DIR, user_input)",
      "with open(file_path, 'r') as f:",
    ],
    aiComment:
      "⚠️ Path traversal vulnerability. Validate and sanitize user_input, use os.path.realpath() and check it starts with BASE_DIR.",
    resolved: false,
  },
  {
    id: "v4",
    title: "CORS Misconfiguration",
    severity: "Medium",
    file: "src/middleware/cors.py",
    line: 5,
    codeLines: [
      'CORS_ALLOWED_ORIGINS = ["*"]',
      "CORS_ALLOW_CREDENTIALS = True",
    ],
    aiComment:
      "🌐 Wildcard CORS with credentials is a critical security risk. Specify exact allowed origins.",
    resolved: false,
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function langColor(lang: Repository["language"]) {
  if (lang === "Python")
    return "bg-blue-500/15 text-blue-400 border-blue-500/30";
  if (lang === "TypeScript")
    return "bg-cyan-500/15 text-cyan-400 border-cyan-500/30";
  return "bg-teal-500/15 text-teal-400 border-teal-500/30";
}

function scoreColor(score: number) {
  if (score < 70)
    return { ring: "#ef4444", text: "text-red-400", label: "text-red-400" };
  if (score < 85)
    return {
      ring: "#f97316",
      text: "text-orange-400",
      label: "text-orange-400",
    };
  return {
    ring: "#10b981",
    text: "text-emerald-400",
    label: "text-emerald-400",
  };
}

function severityConfig(severity: Vulnerability["severity"]) {
  switch (severity) {
    case "Critical":
      return {
        cls: "bg-red-500/15 text-red-400 border-red-500/40",
        icon: <ShieldAlert className="w-3 h-3" />,
      };
    case "High":
      return {
        cls: "bg-orange-500/15 text-orange-400 border-orange-500/40",
        icon: <AlertTriangle className="w-3 h-3" />,
      };
    case "Medium":
      return {
        cls: "bg-yellow-500/15 text-yellow-400 border-yellow-500/40",
        icon: <Shield className="w-3 h-3" />,
      };
    default:
      return {
        cls: "bg-blue-500/15 text-blue-400 border-blue-500/40",
        icon: <Shield className="w-3 h-3" />,
      };
  }
}

// ── Syntax highlighting helpers ───────────────────────────────────────────────
const PY_KEYWORDS = new Set([
  "def",
  "class",
  "import",
  "from",
  "return",
  "if",
  "else",
  "elif",
  "with",
  "as",
  "for",
  "in",
  "not",
  "and",
  "or",
  "True",
  "False",
  "None",
  "open",
]);

function HighlightedLine({ line }: { line: string }) {
  // Comment lines
  if (line.trimStart().startsWith("#")) {
    return <span className="text-[#6b7280]">{line}</span>;
  }
  // Tokenize with regex
  const tokens: {
    text: string;
    type: "keyword" | "string" | "plain" | "var";
  }[] = [];
  const regex = /(\'[^\']*\'|\"[^\"]*\"|f\"[^\"]*\")|([A-Za-z_][A-Za-z0-9_]*)/g;
  let last = 0;
  for (const m of line.matchAll(regex)) {
    if ((m.index ?? 0) > last)
      tokens.push({ text: line.slice(last, m.index), type: "plain" });
    if (m[1]) {
      tokens.push({ text: m[0], type: "string" });
    } else if (PY_KEYWORDS.has(m[2])) {
      tokens.push({ text: m[0], type: "keyword" });
    } else if (m[2] === m[2].toUpperCase() && m[2].length > 1) {
      tokens.push({ text: m[0], type: "var" });
    } else {
      tokens.push({ text: m[0], type: "plain" });
    }
    last = (m.index ?? 0) + m[0].length;
  }
  if (last < line.length)
    tokens.push({ text: line.slice(last), type: "plain" });
  return (
    <span>
      {tokens.map((t) => {
        if (t.type === "keyword")
          return (
            <span key={t.text.slice(0, 8) + t.type} className="text-blue-400">
              {t.text}
            </span>
          );
        if (t.type === "string")
          return (
            <span key={t.text.slice(0, 8) + t.type} className="text-yellow-300">
              {t.text}
            </span>
          );
        if (t.type === "var")
          return (
            <span key={t.text.slice(0, 8) + t.type} className="text-purple-400">
              {t.text}
            </span>
          );
        return (
          <span key={t.text.slice(0, 8) + t.type} className="text-green-300">
            {t.text}
          </span>
        );
      })}
    </span>
  );
}

// ── ScoreCircle ───────────────────────────────────────────────────────────────
function ScoreCircle({ score }: { score: number }) {
  const { ring, label } = scoreColor(score);
  const r = 16;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        className="absolute inset-0 -rotate-90"
        role="img"
        aria-label="Security score"
      >
        <circle
          cx="24"
          cy="24"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="3"
        />
        <circle
          cx="24"
          cy="24"
          r={r}
          fill="none"
          stroke={ring}
          strokeWidth="3"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.8s ease" }}
        />
      </svg>
      <span className={`text-xs font-bold ${label}`}>{score}</span>
    </div>
  );
}

// ── VulnCard ──────────────────────────────────────────────────────────────────
function VulnCard({ vuln, index }: { vuln: Vulnerability; index: number }) {
  const [expanded, setExpanded] = useState(index === 0);
  const [resolved, setResolved] = useState(vuln.resolved);
  const sev = severityConfig(vuln.severity);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35 }}
      data-ocid={`code_review.vuln.item.${index + 1}`}
      className={`glass rounded-xl border border-white/[0.07] overflow-hidden transition-all duration-200 ${
        resolved ? "opacity-50" : ""
      }`}
    >
      {/* Header row */}
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        data-ocid={`code_review.vuln.expand.${index + 1}`}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors text-left"
      >
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${sev.cls}`}
        >
          {sev.icon}
          {vuln.severity}
        </span>
        <span className="flex-1 font-semibold text-foreground text-sm">
          {vuln.title}
        </span>
        <span className="text-[#06B6D4] font-mono text-xs truncate max-w-[180px]">
          {vuln.file}:{vuln.line}
        </span>
        {expanded ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="px-4 pb-4 space-y-3">
              {/* File path */}
              <div className="flex items-center gap-2">
                <FileCode2 className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[#06B6D4] font-mono text-xs">
                  {vuln.file}
                </span>
                <span className="text-muted-foreground text-xs">
                  line {vuln.line}
                </span>
              </div>

              {/* Code block */}
              <div className="rounded-lg bg-[#0D0D0D] border border-white/[0.06] overflow-hidden">
                <div className="flex items-center gap-2 px-3 py-1.5 border-b border-white/[0.06] bg-white/[0.02]">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                  </div>
                  <span className="text-muted-foreground font-mono text-xs">
                    {vuln.file}
                  </span>
                </div>
                <pre className="p-4 font-mono text-sm leading-6 overflow-x-auto">
                  {vuln.codeLines.map((line, i) => (
                    <div key={line.slice(0, 20) + String(i)} className="flex">
                      <span className="text-muted-foreground/40 select-none mr-4 min-w-[2rem] text-right">
                        {vuln.line - vuln.codeLines.length + 1 + i}
                      </span>
                      <HighlightedLine line={line} />
                    </div>
                  ))}
                </pre>
              </div>

              {/* AI comment bubble */}
              <div className="flex items-start gap-2.5 bg-purple-500/[0.08] border border-purple-500/20 rounded-lg px-4 py-3">
                <Bot className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                <p className="text-sm text-purple-300 italic leading-relaxed">
                  {vuln.aiComment}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  data-ocid={`code_review.view_fix_button.${index + 1}`}
                  className="h-7 text-xs border-white/10 hover:border-[#06B6D4]/40 hover:text-[#06B6D4] gap-1.5"
                >
                  <Eye className="w-3 h-3" />
                  View Fix
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  data-ocid={`code_review.resolve_button.${index + 1}`}
                  onClick={() => setResolved((r) => !r)}
                  className={`h-7 text-xs gap-1.5 transition-colors ${
                    resolved
                      ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10"
                      : "border-white/10 hover:border-emerald-500/40 hover:text-emerald-400"
                  }`}
                >
                  <Check className="w-3 h-3" />
                  {resolved ? "Resolved" : "Mark Resolved"}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── RepoCard ──────────────────────────────────────────────────────────────────
function RepoCard({
  repo,
  selected,
  onSelect,
  index,
}: {
  repo: Repository;
  selected: boolean;
  onSelect: () => void;
  index: number;
}) {
  const sc = scoreColor(repo.score);
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07, duration: 0.3 }}
      onClick={onSelect}
      data-ocid={`code_review.repo.item.${index + 1}`}
      className={`w-full text-left rounded-xl border transition-all duration-200 p-4 group ${
        selected
          ? "border-[#06B6D4]/40 bg-[#06B6D4]/[0.06] shadow-[0_0_20px_rgba(6,182,212,0.08)]"
          : "border-white/[0.07] bg-[#111111] hover:border-white/[0.12] hover:bg-white/[0.02]"
      }`}
    >
      <div className="flex items-start gap-3">
        <ScoreCircle score={repo.score} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-sm text-foreground font-semibold truncate">
              {repo.name}
            </span>
            {selected && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] animate-pulse" />
            )}
          </div>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span
              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${langColor(repo.language)}`}
            >
              {repo.language}
            </span>
            <span className="flex items-center gap-1 text-muted-foreground text-xs">
              <GitBranch className="w-3 h-3" />
              {repo.branch}
            </span>
            <span className="flex items-center gap-1 text-muted-foreground text-xs">
              <Star className="w-3 h-3" />
              {repo.stars}
            </span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span
              className={`text-xs font-medium flex items-center gap-1 ${sc.text}`}
            >
              <ShieldCheck className="w-3 h-3" />
              {repo.vulns} vulns
            </span>
            <span className="text-muted-foreground text-xs">
              {repo.lastScan}
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

// ── FilesScanned stub ─────────────────────────────────────────────────────────
const MOCK_FILES = [
  { path: "src/api/users.py", issues: 3, lines: 412, scanned: true },
  { path: "src/config/settings.py", issues: 2, lines: 88, scanned: true },
  { path: "src/api/files.py", issues: 4, lines: 267, scanned: true },
  { path: "src/middleware/cors.py", issues: 1, lines: 34, scanned: true },
  { path: "src/models/user.py", issues: 0, lines: 156, scanned: true },
  { path: "src/utils/crypto.py", issues: 2, lines: 93, scanned: true },
];

function FilesTab() {
  return (
    <div className="space-y-2">
      {MOCK_FILES.map((f, i) => (
        <motion.div
          key={f.path}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          data-ocid={`code_review.file.item.${i + 1}`}
          className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#111111] border border-white/[0.06] hover:border-white/10 transition-colors"
        >
          <FileCode2 className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="font-mono text-sm text-foreground flex-1 truncate">
            {f.path}
          </span>
          <span className="text-muted-foreground text-xs">{f.lines} lines</span>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              f.issues === 0
                ? "bg-emerald-500/10 text-emerald-400"
                : f.issues >= 3
                  ? "bg-red-500/10 text-red-400"
                  : "bg-orange-500/10 text-orange-400"
            }`}
          >
            {f.issues === 0 ? "Clean" : `${f.issues} issues`}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

// ── PullRequestsTab stub ──────────────────────────────────────────────────────
const MOCK_PRS = [
  {
    id: 42,
    title: "feat: add JWT refresh token logic",
    author: "dev-ana",
    status: "reviewed",
    risk: "Medium",
  },
  {
    id: 38,
    title: "fix: patch XSS in comment renderer",
    author: "sec-bot",
    status: "approved",
    risk: "Low",
  },
  {
    id: 35,
    title: "refactor: update user auth flow",
    author: "dev-marco",
    status: "pending",
    risk: "High",
  },
];

function PRsTab() {
  return (
    <div className="space-y-3">
      {MOCK_PRS.map((pr, i) => (
        <motion.div
          key={pr.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
          data-ocid={`code_review.pr.item.${i + 1}`}
          className="flex items-center gap-3 px-4 py-3 rounded-xl glass border border-white/[0.07] hover:border-white/[0.12] transition-colors"
        >
          <GitPullRequest className="w-4 h-4 text-purple-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground font-medium truncate">
              {pr.title}
            </p>
            <p className="text-xs text-muted-foreground">
              #{pr.id} by {pr.author}
            </p>
          </div>
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
              pr.risk === "Low"
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : pr.risk === "Medium"
                  ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                  : "bg-red-500/10 text-red-400 border-red-500/30"
            }`}
          >
            {pr.risk} risk
          </span>
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              pr.status === "approved"
                ? "bg-emerald-500/15 text-emerald-400"
                : pr.status === "reviewed"
                  ? "bg-blue-500/15 text-blue-400"
                  : "bg-orange-500/15 text-orange-400"
            }`}
          >
            {pr.status}
          </span>
          <Button
            size="icon"
            variant="ghost"
            className="w-7 h-7 text-muted-foreground hover:text-foreground"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CodeReviewPage() {
  const [selectedRepo, setSelectedRepo] = useState<string>("1");
  const repo = REPOS.find((r) => r.id === selectedRepo) ?? REPOS[0];

  return (
    <div className="flex flex-col h-full min-h-screen bg-background">
      {/* ── Page Header ── */}
      <div className="border-b border-white/[0.06] bg-[#0A0A0A] px-6 py-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <div className="w-8 h-8 rounded-lg bg-[#06B6D4]/10 border border-[#06B6D4]/20 flex items-center justify-center">
                <Code2 className="w-4 h-4 text-[#06B6D4]" />
              </div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">
                Secure Code Review
              </h1>
            </div>
            <p className="text-muted-foreground text-sm">
              AI-powered static analysis with inline security annotations
            </p>
            {/* Stats row */}
            <div className="flex items-center gap-5 mt-3 flex-wrap">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Zap className="w-3.5 h-3.5 text-[#06B6D4]" />
                <span className="text-foreground font-medium">3</span>{" "}
                repositories
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                <span className="text-foreground font-medium">24</span>{" "}
                vulnerabilities found
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Bot className="w-3.5 h-3.5 text-purple-400" />
                AI coverage:{" "}
                <span className="text-foreground font-medium">94%</span>
              </span>
            </div>
          </div>
          <Button
            data-ocid="code_review.connect_repo_button"
            className="bg-[#06B6D4] hover:bg-[#06B6D4]/90 text-[#0A0A0A] font-semibold gap-2 shrink-0"
          >
            <Plug className="w-4 h-4" />
            Connect Repository
          </Button>
        </div>
      </div>

      {/* ── Split Body ── */}
      <div
        className="flex flex-1 overflow-hidden"
        data-ocid="code_review.panel"
      >
        {/* LEFT: Repo List */}
        <aside
          className="w-[35%] min-w-[260px] max-w-[380px] border-r border-white/[0.06] bg-[#0A0A0A] flex flex-col overflow-y-auto"
          data-ocid="code_review.repo.list"
        >
          <div className="px-4 py-4 border-b border-white/[0.04]">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              Repositories
            </p>
          </div>
          <div className="flex flex-col gap-3 p-4">
            {REPOS.map((repo, i) => (
              <RepoCard
                key={repo.id}
                repo={repo}
                index={i}
                selected={selectedRepo === repo.id}
                onSelect={() => setSelectedRepo(repo.id)}
              />
            ))}
          </div>
        </aside>

        {/* RIGHT: Code Review Panel */}
        <main
          className="flex-1 flex flex-col overflow-y-auto"
          data-ocid="code_review.review.panel"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedRepo}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.25 }}
              className="flex-1 flex flex-col"
            >
              {/* Repo meta bar */}
              <div className="px-6 py-4 border-b border-white/[0.06] bg-[#0D0D0D] flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <span className="font-mono text-sm font-bold text-foreground">
                    {repo.name}
                  </span>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${langColor(repo.language)}`}
                    >
                      {repo.language}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground text-xs">
                      <GitBranch className="w-3 h-3" />
                      {repo.branch}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Last scan: {repo.lastScan}
                    </span>
                  </div>
                </div>
                <ScoreCircle score={repo.score} />
              </div>

              {/* Tabs */}
              <div className="flex-1 px-6 py-5">
                <Tabs
                  defaultValue="vulnerabilities"
                  data-ocid="code_review.tabs"
                >
                  <TabsList className="bg-[#111111] border border-white/[0.07] mb-6">
                    <TabsTrigger
                      value="vulnerabilities"
                      data-ocid="code_review.tab.vulnerabilities"
                      className="data-[state=active]:bg-[#06B6D4]/10 data-[state=active]:text-[#06B6D4] text-xs"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 mr-1.5" />
                      Vulnerabilities ({repo.vulns})
                    </TabsTrigger>
                    <TabsTrigger
                      value="files"
                      data-ocid="code_review.tab.files"
                      className="data-[state=active]:bg-[#06B6D4]/10 data-[state=active]:text-[#06B6D4] text-xs"
                    >
                      <FileCode2 className="w-3.5 h-3.5 mr-1.5" />
                      Files Scanned
                    </TabsTrigger>
                    <TabsTrigger
                      value="prs"
                      data-ocid="code_review.tab.prs"
                      className="data-[state=active]:bg-[#06B6D4]/10 data-[state=active]:text-[#06B6D4] text-xs"
                    >
                      <GitPullRequest className="w-3.5 h-3.5 mr-1.5" />
                      Pull Requests
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent
                    value="vulnerabilities"
                    className="space-y-3 mt-0"
                  >
                    {VULNS.map((v, i) => (
                      <VulnCard key={v.id} vuln={v} index={i} />
                    ))}
                  </TabsContent>

                  <TabsContent value="files" className="mt-0">
                    <FilesTab />
                  </TabsContent>

                  <TabsContent value="prs" className="mt-0">
                    <PRsTab />
                  </TabsContent>
                </Tabs>
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
