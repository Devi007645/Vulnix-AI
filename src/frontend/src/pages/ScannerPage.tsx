import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Circle,
  ExternalLink,
  Info,
  Plus,
  Shield,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

// ── Types ────────────────────────────────────────────────────────────────────
type Severity = "Critical" | "High" | "Medium" | "Low";
type ScanStatus = "Complete" | "Running";

interface ScanEntry {
  id: number;
  target: string;
  status: ScanStatus;
  severity: Severity;
  vulnCount: number;
  date: string;
  progress?: number;
}

interface Vulnerability {
  name: string;
  cvss: number;
  description: string;
  remediation: string;
  confidence: number;
  severity: Severity;
}

// ── Mock data ────────────────────────────────────────────────────────────────
const MOCK_SCANS: ScanEntry[] = [
  {
    id: 1,
    target: "api.nexacorp.com",
    status: "Complete",
    severity: "Critical",
    vulnCount: 12,
    date: "2 hours ago",
  },
  {
    id: 2,
    target: "app.helixsec.io",
    status: "Running",
    severity: "High",
    vulnCount: 3,
    date: "Running",
    progress: 67,
  },
  {
    id: 3,
    target: "dashboard.orbita.co",
    status: "Complete",
    severity: "Medium",
    vulnCount: 5,
    date: "Yesterday",
  },
  {
    id: 4,
    target: "api.ciphertech.io",
    status: "Complete",
    severity: "Critical",
    vulnCount: 18,
    date: "2 days ago",
  },
  {
    id: 5,
    target: "staging.vaultlayer.com",
    status: "Running",
    severity: "Medium",
    vulnCount: 2,
    date: "Running",
    progress: 23,
  },
  {
    id: 6,
    target: "cdn.nexacorp.com",
    status: "Complete",
    severity: "Low",
    vulnCount: 1,
    date: "3 days ago",
  },
];

const MOCK_VULNS: Vulnerability[] = [
  {
    name: "SQL Injection in /api/users endpoint",
    cvss: 9.1,
    description:
      "Input parameters not sanitized. Attacker can extract or modify database contents.",
    remediation:
      "Use parameterized queries and prepared statements for all database interactions.",
    confidence: 98,
    severity: "Critical",
  },
  {
    name: "Outdated OpenSSL 1.0.2",
    cvss: 7.5,
    description:
      "Running a version of OpenSSL with multiple known CVEs including Heartbleed variants.",
    remediation:
      "Upgrade to OpenSSL 3.1+ immediately and rotate all TLS certificates.",
    confidence: 95,
    severity: "High",
  },
  {
    name: "Missing X-Frame-Options header",
    cvss: 4.3,
    description:
      "The application can be embedded in an iframe, enabling clickjacking attacks.",
    remediation:
      "Add X-Frame-Options: DENY to all HTTP responses or use CSP frame-ancestors.",
    confidence: 92,
    severity: "Medium",
  },
];

const SCAN_TYPES = [
  "OWASP Top 10",
  "Port Scan",
  "SSL/TLS",
  "Header Analysis",
  "Subdomain Enumeration",
];

const SPEEDS = ["Fast", "Balanced", "Thorough"] as const;

// ── Utility helpers ───────────────────────────────────────────────────────────
function severityColor(s: Severity): string {
  switch (s) {
    case "Critical":
      return "text-red-400 bg-red-500/10 border-red-500/25";
    case "High":
      return "text-orange-400 bg-orange-500/10 border-orange-500/25";
    case "Medium":
      return "text-amber-400 bg-amber-500/10 border-amber-500/25";
    case "Low":
      return "text-emerald-400 bg-emerald-500/10 border-emerald-500/25";
  }
}

function cvssColor(score: number): string {
  if (score >= 9) return "text-red-400";
  if (score >= 7) return "text-orange-400";
  if (score >= 4) return "text-amber-400";
  return "text-emerald-400";
}

// ── Sub-components ────────────────────────────────────────────────────────────
function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${severityColor(severity)}`}
    >
      {severity}
    </span>
  );
}

function StatusBadge({
  status,
  progress,
}: { status: ScanStatus; progress?: number }) {
  if (status === "Running") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-cyan-400">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
        </span>
        Running {progress !== undefined ? `(${progress}%)` : ""}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
      <Circle className="h-2 w-2 fill-emerald-400" />
      Complete
    </span>
  );
}

function VulnCard({ vuln, index }: { vuln: Vulnerability; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className="glass rounded-lg p-4 border border-white/5"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <SeverityBadge severity={vuln.severity} />
          <span className="text-sm font-medium text-foreground truncate">
            {vuln.name}
          </span>
        </div>
        <span
          className={`text-sm font-mono font-bold shrink-0 ${cvssColor(vuln.cvss)}`}
        >
          CVSS {vuln.cvss}
        </span>
      </div>
      <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
        {vuln.description}
      </p>
      <div className="flex items-start gap-2 mb-3">
        <AlertTriangle className="h-3 w-3 text-amber-400 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-400/80">{vuln.remediation}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground">AI Confidence</span>
        <div className="flex-1">
          <Progress value={vuln.confidence} className="h-1.5" />
        </div>
        <span className="text-xs font-mono text-cyan-400">
          {vuln.confidence}%
        </span>
      </div>
    </motion.div>
  );
}

function ExpandedDetails({ scanId }: { scanId: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="overflow-hidden"
    >
      <div className="px-4 pb-4 pt-2">
        <div className="rounded-lg border border-white/5 bg-black/30 p-4">
          <div className="flex items-center gap-2 mb-4">
            <Info className="h-4 w-4 text-cyan-400" />
            <span className="text-sm font-semibold text-foreground">
              Vulnerability Details — Scan #{scanId}
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {MOCK_VULNS.map((v, i) => (
              <VulnCard key={v.name} vuln={v} index={i} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ScanRow({
  scan,
  index,
  isExpanded,
  onToggle,
  liveProgress,
}: {
  scan: ScanEntry;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  liveProgress: number;
}) {
  const progress = scan.status === "Running" ? liveProgress : undefined;

  return (
    <>
      <motion.tr
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.06 }}
        onClick={onToggle}
        className="border-b border-white/5 cursor-pointer group transition-colors hover:bg-white/[0.03]"
        data-ocid={`scanner.row.item.${index + 1}`}
      >
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-foreground">
              {scan.target}
            </span>
          </div>
        </td>
        <td className="px-4 py-3">
          <StatusBadge status={scan.status} progress={scan.progress} />
        </td>
        <td className="px-4 py-3">
          <SeverityBadge severity={scan.severity} />
        </td>
        <td className="px-4 py-3">
          <span className="text-sm font-mono text-foreground">
            {scan.vulnCount}
          </span>
        </td>
        <td className="px-4 py-3 min-w-[160px]">
          {scan.status === "Running" ? (
            <div className="flex flex-col gap-1">
              <Progress value={progress} className="h-1.5 w-32" />
              <span className="text-xs text-cyan-400 font-mono">
                {progress}%
              </span>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">{scan.date}</span>
          )}
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              className="h-7 px-3 text-xs border-white/10 hover:border-cyan-500/50 hover:text-cyan-400 transition-smooth"
              data-ocid={`scanner.view_details_button.${index + 1}`}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              View Details
            </Button>
            <span className="text-muted-foreground">
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </span>
          </div>
        </td>
      </motion.tr>
      {isExpanded && (
        <tr>
          <td colSpan={6} className="p-0">
            <AnimatePresence>
              <ExpandedDetails scanId={scan.id} />
            </AnimatePresence>
          </td>
        </tr>
      )}
    </>
  );
}

// ── New Scan Modal ────────────────────────────────────────────────────────────
function NewScanModal({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  const [targetUrl, setTargetUrl] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([
    "OWASP Top 10",
  ]);
  const [speed, setSpeed] = useState<"Fast" | "Balanced" | "Thorough">(
    "Balanced",
  );

  function toggleType(t: string) {
    setSelectedTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="glass border-white/10 max-w-lg"
        data-ocid="scanner.new_scan_dialog"
      >
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <Shield className="h-5 w-5 text-cyan-400" />
            Configure New Scan
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5 py-2">
          {/* Target URL */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm text-muted-foreground">
              Target URL or IP
            </Label>
            <Input
              placeholder="Enter target URL or IP"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="bg-black/40 border-white/10 focus:border-cyan-500/50 font-mono text-sm"
              data-ocid="scanner.target_input"
            />
          </div>

          {/* Scan Types */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm text-muted-foreground">Scan Type</Label>
            <div className="grid grid-cols-2 gap-2">
              {SCAN_TYPES.map((t) => (
                <label
                  key={t}
                  className="flex items-center gap-2 cursor-pointer group"
                  data-ocid={`scanner.scan_type_checkbox.${t.toLowerCase().replace(/\s+/g, "_")}`}
                >
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(t)}
                    onChange={() => toggleType(t)}
                    className="w-3.5 h-3.5 accent-cyan-500"
                  />
                  <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                    {t}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Scan Speed */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm text-muted-foreground">Scan Speed</Label>
            <div className="flex gap-3">
              {SPEEDS.map((s) => (
                <label
                  key={s}
                  className="flex items-center gap-2 cursor-pointer"
                  data-ocid={`scanner.speed_radio.${s.toLowerCase()}`}
                >
                  <input
                    type="radio"
                    name="speed"
                    value={s}
                    checked={speed === s}
                    onChange={() => setSpeed(s)}
                    className="accent-cyan-500"
                  />
                  <span
                    className={`text-sm transition-colors ${
                      speed === s
                        ? "text-cyan-400 font-medium"
                        : "text-foreground/70"
                    }`}
                  >
                    {s}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <p className="text-xs text-muted-foreground border border-white/5 rounded-md px-3 py-2 bg-white/[0.02]">
            ⚠️ Demo — scanning is simulated
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="border-white/10"
            data-ocid="scanner.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={onClose}
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold glow-cyan transition-smooth"
            data-ocid="scanner.start_scan_button"
          >
            Start Scan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ScannerPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [liveProgresses, setLiveProgresses] = useState<Record<number, number>>(
    () =>
      Object.fromEntries(
        MOCK_SCANS.filter((s) => s.status === "Running").map((s) => [
          s.id,
          s.progress ?? 0,
        ]),
      ),
  );

  // Animate running scan progress bars
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setLiveProgresses((prev) => {
        const next = { ...prev };
        for (const id in next) {
          next[id] = Math.min(99, next[id] + Math.random() * 0.4);
        }
        return next;
      });
    }, 600);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const tabCounts = {
    all: MOCK_SCANS.length,
    critical: MOCK_SCANS.filter((s) => s.severity === "Critical").length,
    high: MOCK_SCANS.filter((s) => s.severity === "High").length,
    medium: MOCK_SCANS.filter((s) => s.severity === "Medium").length,
    low: MOCK_SCANS.filter((s) => s.severity === "Low").length,
  };

  const filteredScans =
    activeTab === "all"
      ? MOCK_SCANS
      : MOCK_SCANS.filter((s) => s.severity.toLowerCase() === activeTab);

  function toggleRow(id: number) {
    setExpandedRow((prev) => (prev === id ? null : id));
  }

  return (
    <div
      className="flex flex-col gap-8 p-6 min-h-full"
      data-ocid="scanner.page"
    >
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col gap-5"
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                <Shield className="h-5 w-5 text-cyan-400" />
              </div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                Vulnerability Scanner
              </h1>
            </div>
            <p className="text-sm text-muted-foreground ml-12">
              AI-powered scanning for OWASP vulnerabilities, ports, SSL, and
              misconfigs
            </p>
          </div>
          <Button
            onClick={() => setModalOpen(true)}
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold glow-cyan transition-smooth shrink-0"
            data-ocid="scanner.new_scan_button"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Scan
          </Button>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-6 flex-wrap">
          {[
            { label: "Total Scans", value: "6", color: "text-foreground" },
            { label: "In Progress", value: "2", color: "text-cyan-400" },
            { label: "Critical Findings", value: "3", color: "text-red-400" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-2">
              <span className={`text-lg font-bold font-mono ${stat.color}`}>
                {stat.value}
              </span>
              <span className="text-sm text-muted-foreground">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Tabs + Table ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="glass rounded-xl border border-white/8 overflow-hidden"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b border-white/5 px-4 pt-4">
            <TabsList
              className="bg-transparent gap-1 h-auto p-0"
              data-ocid="scanner.severity_tabs"
            >
              {[
                { value: "all", label: "All", count: tabCounts.all },
                {
                  value: "critical",
                  label: "Critical",
                  count: tabCounts.critical,
                  color: "text-red-400",
                },
                {
                  value: "high",
                  label: "High",
                  count: tabCounts.high,
                  color: "text-orange-400",
                },
                {
                  value: "medium",
                  label: "Medium",
                  count: tabCounts.medium,
                  color: "text-amber-400",
                },
                {
                  value: "low",
                  label: "Low",
                  count: tabCounts.low,
                  color: "text-emerald-400",
                },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="px-3 pb-3 pt-1 text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-cyan-400 data-[state=active]:text-foreground text-muted-foreground hover:text-foreground transition-colors bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  data-ocid={`scanner.tab.${tab.value}`}
                >
                  {tab.label}
                  <span
                    className={`ml-1.5 text-xs font-mono ${
                      activeTab === tab.value
                        ? (tab.color ?? "text-cyan-400")
                        : "text-muted-foreground"
                    }`}
                  >
                    ({tab.count})
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {["all", "critical", "high", "medium", "low"].map((tabVal) => (
            <TabsContent
              key={tabVal}
              value={tabVal}
              className="m-0 focus-visible:outline-none"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      {[
                        "Target",
                        "Status",
                        "Severity",
                        "Vulns Found",
                        "Last Scan",
                        "Actions",
                      ].map((col) => (
                        <th
                          key={col}
                          className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredScans.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-12 text-center text-muted-foreground text-sm"
                          data-ocid="scanner.empty_state"
                        >
                          No scans match this filter.
                        </td>
                      </tr>
                    ) : (
                      filteredScans.map((scan, i) => (
                        <ScanRow
                          key={scan.id}
                          scan={scan}
                          index={i}
                          isExpanded={expandedRow === scan.id}
                          onToggle={() => toggleRow(scan.id)}
                          liveProgress={Math.round(
                            liveProgresses[scan.id] ?? scan.progress ?? 0,
                          )}
                        />
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>

      {/* Modal */}
      <NewScanModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
