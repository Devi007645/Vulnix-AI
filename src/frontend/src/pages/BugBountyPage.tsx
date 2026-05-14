import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  AlertTriangle,
  ChevronRight,
  Circle,
  Clock,
  Cpu,
  DollarSign,
  Download,
  Globe,
  Plus,
  RefreshCw,
  Search,
  Target,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface BountyTarget {
  id: number;
  name: string;
  platform: string;
  scope: string;
  status: "Active" | "Paused";
  endpoints: number;
  params: number;
  findings: number;
  lastScan: string;
  bounty: string;
}

interface AiHint {
  id: number;
  type: string;
  confidence: number;
  severity: "high" | "medium" | "low";
  description: string;
  endpoint: string;
}

// ── Mock Data ─────────────────────────────────────────────────────────────────
const TARGETS: BountyTarget[] = [
  {
    id: 1,
    name: "NexaCorp",
    platform: "HackerOne",
    scope: "*.nexacorp.com",
    status: "Active",
    endpoints: 847,
    params: 234,
    findings: 12,
    lastScan: "2h ago",
    bounty: "$500–$15K",
  },
  {
    id: 2,
    name: "HelixSec",
    platform: "Bugcrowd",
    scope: "app.helixsec.io",
    status: "Active",
    endpoints: 312,
    params: 89,
    findings: 7,
    lastScan: "5h ago",
    bounty: "$250–$8K",
  },
  {
    id: 3,
    name: "Orbita",
    platform: "Private",
    scope: "api.orbita.co",
    status: "Paused",
    endpoints: 156,
    params: 45,
    findings: 3,
    lastScan: "2d ago",
    bounty: "Invite only",
  },
  {
    id: 4,
    name: "VaultLayer",
    platform: "HackerOne",
    scope: "*.vaultlayer.com",
    status: "Active",
    endpoints: 2106,
    params: 678,
    findings: 25,
    lastScan: "30m ago",
    bounty: "$1K–$50K",
  },
];

const TERMINAL_LINES = [
  {
    id: "t01",
    prefix: "[*]",
    text: " Starting subdomain enumeration for *.nexacorp.com",
    color: "text-cyan-400",
  },
  {
    id: "t02",
    prefix: "[+]",
    text: " Found: api.nexacorp.com (200 OK)",
    color: "text-green-400",
  },
  {
    id: "t03",
    prefix: "[+]",
    text: " Found: staging.nexacorp.com (403 Forbidden)",
    color: "text-green-400",
  },
  {
    id: "t04",
    prefix: "[+]",
    text: " Found: admin.nexacorp.com (301 Redirect)",
    color: "text-green-400",
  },
  {
    id: "t05",
    prefix: "[+]",
    text: " Found: dev.nexacorp.com (200 OK)",
    color: "text-green-400",
  },
  {
    id: "t06",
    prefix: "[*]",
    text: " Running port scan on api.nexacorp.com...",
    color: "text-cyan-400",
  },
  {
    id: "t07",
    prefix: "[+]",
    text: " Port 80: HTTP (nginx/1.19.0)",
    color: "text-green-400",
  },
  {
    id: "t08",
    prefix: "[+]",
    text: " Port 443: HTTPS (nginx/1.19.0)",
    color: "text-green-400",
  },
  {
    id: "t09",
    prefix: "[+]",
    text: " Port 8080: HTTP (tomcat)",
    color: "text-green-400",
  },
  {
    id: "t10",
    prefix: "[*]",
    text: " Extracting JS files from api.nexacorp.com...",
    color: "text-cyan-400",
  },
  {
    id: "t11",
    prefix: "[+]",
    text: " Found 23 JS files, 847 endpoints",
    color: "text-green-400",
  },
  {
    id: "t12",
    prefix: "[!]",
    text: " Interesting: /api/v1/users — No auth header required!",
    color: "text-yellow-400",
  },
  {
    id: "t13",
    prefix: "[!]",
    text: " Interesting: /api/admin/config — Returns server version",
    color: "text-yellow-400",
  },
  {
    id: "t14",
    prefix: "[AI]",
    text: " Analyzing parameters for injection vulnerabilities...",
    color: "text-purple-400",
  },
  {
    id: "t15",
    prefix: "[AI]",
    text: " High confidence: IDOR possible at /api/users/{id}",
    color: "text-red-400",
  },
  {
    id: "t16",
    prefix: "[AI]",
    text: " Medium confidence: XSS in search parameter at /api/search?q=",
    color: "text-orange-400",
  },
  {
    id: "t17",
    prefix: "[*]",
    text: " Scan complete. 12 findings. 847 endpoints mapped.",
    color: "text-cyan-400",
  },
];

const AI_HINTS: AiHint[] = [
  {
    id: 1,
    type: "IDOR",
    confidence: 94,
    severity: "high",
    description:
      "Object reference not validated at /api/v1/users/{id}. Sequential IDs suggest enumerable resources with insufficient authorization checks.",
    endpoint: "/api/v1/users/{id}",
  },
  {
    id: 2,
    type: "Reflected XSS",
    confidence: 71,
    severity: "medium",
    description:
      "Search parameter `q` reflected unsanitized in response body. CSP headers absent, enabling script injection.",
    endpoint: "/api/search?q=",
  },
  {
    id: 3,
    type: "Info Disclosure",
    confidence: 58,
    severity: "low",
    description:
      "Admin config endpoint returns internal server version and stack details. No auth required on staging environment.",
    endpoint: "/api/admin/config",
  },
];

// ── Severity styles ───────────────────────────────────────────────────────────
const SEVERITY_STYLES = {
  high: {
    border: "border-red-500/40",
    bg: "bg-red-500/5",
    badge: "bg-red-500/20 text-red-400 border border-red-500/30",
    bar: "bg-red-500",
    dot: "bg-red-500",
    label: "HIGH",
  },
  medium: {
    border: "border-orange-500/40",
    bg: "bg-orange-500/5",
    badge: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
    bar: "bg-orange-500",
    dot: "bg-orange-500",
    label: "MEDIUM",
  },
  low: {
    border: "border-yellow-500/40",
    bg: "bg-yellow-500/5",
    badge: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    bar: "bg-yellow-500",
    dot: "bg-yellow-500",
    label: "LOW",
  },
};

// ── Target Card ───────────────────────────────────────────────────────────────
function TargetCard({
  target,
  selected,
  onClick,
  index,
}: {
  target: BountyTarget;
  selected: boolean;
  onClick: () => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35 }}
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      data-ocid={`target.item.${index + 1}`}
      className={`relative cursor-pointer rounded-xl border p-4 transition-all duration-200 glass ${
        selected
          ? "border-cyan-500/60 shadow-[inset_0_0_0_1px_rgba(6,182,212,0.15)] bg-cyan-500/5"
          : "border-white/[0.06] hover:border-white/[0.12]"
      }`}
    >
      {/* Cyan left accent bar for selected */}
      {selected && (
        <div className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
      )}

      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0">
          <p className="font-semibold text-sm text-foreground truncate">
            {target.name}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {target.platform}
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {target.status === "Active" ? (
            <span className="flex items-center gap-1 text-xs font-medium text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Active
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <Circle className="w-2 h-2 fill-current" />
              Paused
            </span>
          )}
        </div>
      </div>

      {/* Scope */}
      <div className="flex items-center gap-1.5 mb-3">
        <Globe className="w-3 h-3 text-cyan-500 shrink-0" />
        <span className="text-xs font-mono text-cyan-400/80 truncate">
          {target.scope}
        </span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          { label: "Endpoints", value: target.endpoints.toLocaleString() },
          { label: "Params", value: target.params.toLocaleString() },
          { label: "Findings", value: target.findings.toString() },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white/[0.03] rounded-lg px-2 py-1.5 text-center"
          >
            <p className="text-sm font-bold text-foreground">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          {target.lastScan}
        </span>
        <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
          <DollarSign className="w-3 h-3" />
          {target.bounty}
        </span>
      </div>
    </motion.div>
  );
}

// ── Terminal ──────────────────────────────────────────────────────────────────
function Terminal() {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [running, setRunning] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleLines(0);
    setRunning(true);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleLines(i);
      if (i >= TERMINAL_LINES.length) {
        clearInterval(interval);
        setRunning(false);
      }
    }, 80);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div
      data-ocid="terminal.panel"
      className="flex flex-col rounded-xl overflow-hidden border border-white/[0.06] bg-black"
    >
      {/* Terminal header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.04] border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          <span className="text-xs text-muted-foreground font-mono ml-2">
            recon_output — bash
          </span>
          {running && (
            <span
              className="ml-1 text-[10px] font-mono text-cyan-400 animate-pulse"
              data-ocid="terminal.loading_state"
            >
              ● running
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            data-ocid="terminal.reload_button"
            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
            onClick={() => {
              setVisibleLines(0);
              setRunning(true);
              let i = 0;
              const interval = setInterval(() => {
                i++;
                setVisibleLines(i);
                if (i >= TERMINAL_LINES.length) {
                  clearInterval(interval);
                  setRunning(false);
                }
              }, 80);
            }}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            data-ocid="terminal.download_button"
            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
          >
            <Download className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Terminal body */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-sm h-[280px] space-y-0.5">
        <AnimatePresence>
          {TERMINAL_LINES.slice(0, visibleLines).map((line) => (
            <motion.div
              key={line.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className="flex gap-1 leading-5"
            >
              <span className={`font-bold shrink-0 ${line.color}`}>
                {line.prefix}
              </span>
              <span className="text-green-300/90">{line.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        {/* Blinking cursor */}
        {visibleLines <= TERMINAL_LINES.length && (
          <div className="flex items-center gap-1 mt-1">
            <span className="text-green-400">&gt;</span>
            <span
              className="inline-block w-2 h-[14px] bg-green-400"
              style={{ animation: "blink 1s step-end infinite" }}
            />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <style>{"@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }"}</style>
    </div>
  );
}

// ── AI Hint Card ──────────────────────────────────────────────────────────────
function AiHintCard({ hint, index }: { hint: AiHint; index: number }) {
  const s = SEVERITY_STYLES[hint.severity];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 + index * 0.1, duration: 0.35 }}
      data-ocid={`ai-hint.item.${index + 1}`}
      className={`rounded-xl border p-4 ${s.border} ${s.bg} glass flex flex-col gap-3`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <AlertTriangle
            className={`w-4 h-4 ${
              hint.severity === "high"
                ? "text-red-400"
                : hint.severity === "medium"
                  ? "text-orange-400"
                  : "text-yellow-400"
            }`}
          />
          <span className="font-bold text-sm text-foreground">{hint.type}</span>
        </div>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.badge}`}
        >
          {s.label}
        </span>
      </div>

      {/* Confidence bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
            AI Confidence
          </span>
          <span className="text-xs font-bold text-foreground">
            {hint.confidence}%
          </span>
        </div>
        <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${hint.confidence}%` }}
            transition={{
              delay: 0.7 + index * 0.1,
              duration: 0.6,
              ease: "easeOut",
            }}
            className={`h-full rounded-full ${s.bar}`}
          />
        </div>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        {hint.description}
      </p>

      <div className="flex items-center justify-between gap-2">
        <code className="text-[10px] font-mono text-cyan-400/70 truncate">
          {hint.endpoint}
        </code>
        <Button
          type="button"
          size="sm"
          variant="outline"
          data-ocid={`ai-hint.investigate_button.${index + 1}`}
          className="h-6 text-[10px] px-2.5 shrink-0 border-white/10 hover:border-cyan-500/40 hover:text-cyan-400"
        >
          Investigate
          <ChevronRight className="w-3 h-3 ml-0.5" />
        </Button>
      </div>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function BugBountyPage() {
  const [selectedId, setSelectedId] = useState<number>(1);
  const selected = TARGETS.find((t) => t.id === selectedId) ?? TARGETS[0];

  return (
    <div
      data-ocid="bug-bounty.page"
      className="flex flex-col gap-6 p-6 min-h-full"
    >
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
              <Target className="w-5 h-5 text-cyan-400" />
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Bug Bounty AI
            </h1>
          </div>
          <p className="text-sm text-muted-foreground ml-0.5">
            AI-powered recon automation and vulnerability discovery
          </p>
          {/* Quick stats */}
          <div className="flex items-center gap-4 mt-3">
            {[
              {
                icon: Activity,
                value: "4",
                label: "active targets",
                color: "text-cyan-400",
              },
              {
                icon: Search,
                value: "3,421",
                label: "endpoints discovered",
                color: "text-purple-400",
              },
              {
                icon: Zap,
                value: "47",
                label: "interesting findings",
                color: "text-yellow-400",
              },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-1.5">
                <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
                <span className="text-sm font-bold text-foreground">
                  {stat.value}
                </span>
                <span className="text-xs text-muted-foreground">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
        <Button
          type="button"
          data-ocid="bug-bounty.add_target_button"
          className="shrink-0 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add Target
        </Button>
      </motion.div>

      {/* ── Two-column layout ─────────────────────────────────────────────── */}
      <div className="flex gap-5 flex-1 min-h-0">
        {/* Left panel — 40% target list */}
        <div
          data-ocid="target.list"
          className="w-[40%] shrink-0 flex flex-col gap-3"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              Targets ({TARGETS.length})
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              data-ocid="target.filter_button"
              className="h-6 text-[10px] px-2 text-muted-foreground hover:text-foreground"
            >
              All platforms
            </Button>
          </div>
          {TARGETS.map((t, i) => (
            <TargetCard
              key={t.id}
              target={t}
              selected={selectedId === t.id}
              onClick={() => setSelectedId(t.id)}
              index={i}
            />
          ))}
        </div>

        {/* Right panel — 60% workspace */}
        <div
          data-ocid="workspace.panel"
          className="flex-1 flex flex-col gap-4 min-w-0"
        >
          {/* Stats bar */}
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="glass rounded-xl border border-white/[0.06] p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span className="font-semibold text-sm text-foreground">
                  {selected.name}
                </span>
                <Badge
                  variant="outline"
                  className="text-[10px] px-2 py-0 h-5 font-mono border-white/10 text-muted-foreground"
                >
                  {selected.scope}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  data-ocid="workspace.rescan_button"
                  className="h-7 text-xs border-white/10 hover:border-cyan-500/40 hover:text-cyan-400 gap-1.5"
                >
                  <RefreshCw className="w-3 h-3" />
                  Rescan
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  data-ocid="workspace.export_button"
                  className="h-7 text-xs border-white/10 hover:border-purple-500/40 hover:text-purple-400 gap-1.5"
                >
                  <Download className="w-3 h-3" />
                  Export
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                {
                  label: "Endpoints",
                  value: selected.endpoints.toLocaleString(),
                  color: "text-cyan-400",
                },
                {
                  label: "Parameters",
                  value: selected.params.toLocaleString(),
                  color: "text-purple-400",
                },
                {
                  label: "Findings",
                  value: selected.findings.toString(),
                  color: "text-red-400",
                },
                {
                  label: "Last Scan",
                  value: selected.lastScan,
                  color: "text-muted-foreground",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-white/[0.03] rounded-lg px-3 py-2.5 border border-white/[0.04]"
                >
                  <p className={`text-base font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Terminal */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Recon Output
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            </div>
            <Terminal />
          </div>

          {/* AI Hints */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 mb-0.5">
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                AI Vulnerability Hints
              </span>
            </div>
            <div data-ocid="ai-hints.list" className="grid grid-cols-3 gap-3">
              {AI_HINTS.map((hint, i) => (
                <AiHintCard key={hint.id} hint={hint} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
