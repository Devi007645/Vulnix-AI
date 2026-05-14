import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  AlertTriangle,
  BookOpen,
  Bug,
  CheckCircle2,
  FileText,
  Globe,
  Lock,
  Minus,
  Search,
  Shield,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ── Mock data ────────────────────────────────────────────────────────────────

const threatTrendData = [
  { day: "Mon", critical: 12, high: 28 },
  { day: "Tue", critical: 18, high: 35 },
  { day: "Wed", critical: 9, high: 22 },
  { day: "Thu", critical: 24, high: 40 },
  { day: "Fri", critical: 15, high: 31 },
  { day: "Sat", critical: 7, high: 18 },
  { day: "Sun", critical: 21, high: 38 },
];

const vulnSeverityData = [
  { name: "Critical", value: 18, color: "#EF4444" },
  { name: "High", value: 42, color: "#F97316" },
  { name: "Medium", value: 65, color: "#EAB308" },
  { name: "Low", value: 22, color: "#22C55E" },
];

const totalVulns = vulnSeverityData.reduce((acc, d) => acc + d.value, 0);

type Severity = "critical" | "high" | "info" | "medium" | "success";

interface ActivityEvent {
  id: number;
  icon: React.ElementType;
  text: string;
  time: string;
  severity: Severity;
}

const initialEvents: ActivityEvent[] = [
  {
    id: 1,
    icon: AlertTriangle,
    text: "Critical SQL injection vulnerability detected on api.example.com",
    time: "2m ago",
    severity: "critical",
  },
  {
    id: 2,
    icon: Search,
    text: "Recon scan completed for target app.helixsec.io",
    time: "5m ago",
    severity: "info",
  },
  {
    id: 3,
    icon: Users,
    text: "New team member joined: alex@nexacorp.com",
    time: "12m ago",
    severity: "success",
  },
  {
    id: 4,
    icon: Lock,
    text: "SSL certificate expires in 7 days for vault.orbita.co",
    time: "18m ago",
    severity: "high",
  },
  {
    id: 5,
    icon: Bug,
    text: "Bug bounty report submitted for target XSS finding",
    time: "25m ago",
    severity: "high",
  },
  {
    id: 6,
    icon: Sparkles,
    text: "AI generated remediation plan for 3 vulnerabilities",
    time: "31m ago",
    severity: "info",
  },
  {
    id: 7,
    icon: Globe,
    text: "Port scan detected open port 8080 on staging server",
    time: "44m ago",
    severity: "medium",
  },
  {
    id: 8,
    icon: BookOpen,
    text: "Learning challenge completed: Advanced SQL Injection",
    time: "58m ago",
    severity: "success",
  },
];

const liveEventPool: ActivityEvent[] = [
  {
    id: 100,
    icon: ShieldAlert,
    text: "Brute-force attack blocked on admin.vulnix.io",
    time: "just now",
    severity: "critical",
  },
  {
    id: 101,
    icon: Activity,
    text: "Anomalous outbound traffic detected from 10.0.0.42",
    time: "just now",
    severity: "high",
  },
  {
    id: 102,
    icon: Zap,
    text: "AI scan completed: 3 new findings on beta.sightwave.com",
    time: "just now",
    severity: "info",
  },
  {
    id: 103,
    icon: Lock,
    text: "Expired TLS cert replaced automatically on auth.orbita.co",
    time: "just now",
    severity: "success",
  },
  {
    id: 104,
    icon: Globe,
    text: "DNS misconfiguration detected on subdomain tracker.helixsec.io",
    time: "just now",
    severity: "medium",
  },
  {
    id: 105,
    icon: FileText,
    text: "Weekly compliance report generated and sent to team",
    time: "just now",
    severity: "info",
  },
];

const severityConfig: Record<
  Severity,
  { dot: string; badge: string; label: string }
> = {
  critical: {
    dot: "bg-red-500",
    badge: "bg-red-500/15 text-red-400 border-red-500/30",
    label: "Critical",
  },
  high: {
    dot: "bg-orange-500",
    badge: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    label: "High",
  },
  medium: {
    dot: "bg-yellow-500",
    badge: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    label: "Medium",
  },
  success: {
    dot: "bg-emerald-500",
    badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    label: "Info",
  },
  info: {
    dot: "bg-cyan-500",
    badge: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    label: "Info",
  },
};

const aiInsights = [
  {
    severity: "critical" as Severity,
    text: "2 critical vulnerabilities need immediate attention",
  },
  { severity: "high" as Severity, text: "SSL renewal required within 7 days" },
  {
    severity: "success" as Severity,
    text: "Security score improved 3 points this week",
  },
  {
    severity: "info" as Severity,
    text: "15 new attack patterns detected in threat feed",
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  trend: "up" | "down" | "stable";
  trendValue: string;
  accent: string;
  iconBg: string;
  delay: number;
}

function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  trendValue,
  accent,
  iconBg,
  delay,
}: StatCardProps) {
  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor =
    trend === "up"
      ? "text-red-400"
      : trend === "down"
        ? "text-emerald-400"
        : "text-muted-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass rounded-xl p-5 hover-lift cursor-default"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}
        >
          <Icon className={`w-5 h-5 ${accent}`} />
        </div>
        <div
          className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}
        >
          <TrendIcon className="w-3 h-3" />
          <span>{trendValue}</span>
        </div>
      </div>
      <div className={`text-3xl font-bold mb-1 ${accent}`}>{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </motion.div>
  );
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function DarkTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-lg px-3 py-2 text-xs">
      <p className="text-muted-foreground mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: <span className="font-semibold">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

function PieCenterLabel() {
  return (
    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
      <tspan x="50%" dy="-8" fill="#e5e7eb" fontSize="22" fontWeight="700">
        {totalVulns}
      </tspan>
      <tspan x="50%" dy="20" fill="#6b7280" fontSize="11">
        Total
      </tspan>
    </text>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function OverviewPage() {
  const [events, setEvents] = useState<ActivityEvent[]>(initialEvents);
  const [liveIdx, setLiveIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setEvents((prev) => {
        const next = {
          ...liveEventPool[liveIdx % liveEventPool.length],
          id: Date.now(),
        };
        return [next, ...prev].slice(0, 8);
      });
      setLiveIdx((i) => i + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, [liveIdx]);

  return (
    <div className="p-6 space-y-6 min-h-screen" data-ocid="overview.page">
      {/* SECTION 1: Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Security Overview
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Shield className="w-3 h-3" />
              Security Score: 87/100
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Last updated: <span className="text-cyan-400">just now</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold gap-2 glow-cyan transition-smooth"
            data-ocid="overview.run_scan_button"
          >
            <Zap className="w-4 h-4" />
            Run Scan
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="border-border hover:border-cyan-500/50 hover:text-cyan-400 gap-2 transition-smooth"
            data-ocid="overview.export_report_button"
          >
            <FileText className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </motion.div>

      {/* SECTION 2: Stat Cards */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        data-ocid="overview.stats.section"
      >
        <StatCard
          icon={ShieldAlert}
          label="Active Threats"
          value="23"
          trend="up"
          trendValue="↑ 12% this week"
          accent="text-red-400"
          iconBg="bg-red-500/15"
          delay={0}
        />
        <StatCard
          icon={Bug}
          label="Vulnerabilities Found"
          value="147"
          trend="down"
          trendValue="↓ 8% this week"
          accent="text-orange-400"
          iconBg="bg-orange-500/15"
          delay={0.1}
        />
        <StatCard
          icon={Sparkles}
          label="AI Recommendations"
          value="94"
          trend="stable"
          trendValue="Stable"
          accent="text-purple-400"
          iconBg="bg-purple-500/15"
          delay={0.2}
        />
        <StatCard
          icon={CheckCircle2}
          label="Security Score"
          value="87/100"
          trend="up"
          trendValue="↑ 3 pts"
          accent="text-cyan-400"
          iconBg="bg-cyan-500/15"
          delay={0.3}
        />
      </div>

      {/* SECTION 3: Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        data-ocid="overview.charts.section"
      >
        {/* Area Chart */}
        <div className="glass rounded-xl p-5">
          <h2 className="text-sm font-semibold text-foreground mb-1">
            Threat Trends
          </h2>
          <p className="text-xs text-muted-foreground mb-4">Last 7 days</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={threatTrendData}
              margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="gradCritical" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradHigh" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F97316" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
              />
              <XAxis
                dataKey="day"
                tick={{ fill: "#06B6D4", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#06B6D4", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<DarkTooltip />} />
              <Area
                type="monotone"
                dataKey="critical"
                name="Critical"
                stroke="#EF4444"
                strokeWidth={2}
                fill="url(#gradCritical)"
              />
              <Area
                type="monotone"
                dataKey="high"
                name="High"
                stroke="#F97316"
                strokeWidth={2}
                fill="url(#gradHigh)"
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
              Critical
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" />
              High
            </span>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="glass rounded-xl p-5">
          <h2 className="text-sm font-semibold text-foreground mb-1">
            Vulnerability Severity
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            Current distribution
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={vulnSeverityData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {vulnSeverityData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
                <PieCenterLabel />
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [value, name]}
                contentStyle={{
                  background: "rgba(17,17,17,0.95)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                itemStyle={{ color: "#e5e7eb" }}
                labelStyle={{ color: "#6b7280" }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
            {vulnSeverityData.map((d) => (
              <div key={d.name} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: d.color }}
                  />
                  {d.name}
                </span>
                <span className="text-xs font-semibold text-foreground">
                  {d.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* SECTION 4: Activity + AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
        data-ocid="overview.activity.section"
      >
        {/* Activity Feed */}
        <div
          className="lg:col-span-2 glass rounded-xl p-5"
          data-ocid="overview.activity_feed"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Recent Activity Feed
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Live security event stream
              </p>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          </div>
          <div className="space-y-1 scrollbar-cyber overflow-y-auto max-h-[340px]">
            {events.map((event, idx) => {
              const cfg = severityConfig[event.severity];
              const Icon = event.icon;
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-start gap-3 py-2.5 px-3 rounded-lg hover:bg-white/[0.03] transition-smooth"
                  data-ocid={`overview.activity_feed.item.${idx + 1}`}
                >
                  <div
                    className={`mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`}
                  />
                  <div
                    className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${cfg.dot.replace("bg-", "bg-").replace("500", "500/15")}`}
                  >
                    <Icon
                      className={`w-3.5 h-3.5 ${cfg.badge.split(" ").find((c) => c.startsWith("text-")) ?? "text-muted-foreground"}`}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground flex-1 leading-relaxed min-w-0">
                    {event.text}
                  </p>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {event.time}
                    </span>
                    <span
                      className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${cfg.badge}`}
                    >
                      {cfg.label}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* AI Insights */}
        <div
          className="glass rounded-xl p-5 flex flex-col"
          data-ocid="overview.ai_insights"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                AI Security Insights
              </h2>
              <p className="text-xs text-muted-foreground">
                Powered by Vulnix AI
              </p>
            </div>
          </div>

          <div className="space-y-3 flex-1">
            {aiInsights.map((insight, idx) => {
              const cfg = severityConfig[insight.severity];
              return (
                <div
                  key={insight.text || idx}
                  className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white/[0.025] border border-white/[0.04]"
                  data-ocid={`overview.ai_insights.item.${idx + 1}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0 ${cfg.dot}`}
                  />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {insight.text}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-5 pt-4 border-t border-white/[0.06]">
            <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
              Quick Actions
            </p>
            <div className="space-y-2">
              <Button
                type="button"
                size="sm"
                className="w-full justify-start gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 hover:border-cyan-500/40 transition-smooth text-xs h-8"
                data-ocid="overview.quick_action.run_scan_button"
              >
                <Search className="w-3.5 h-3.5" />
                Run Vulnerability Scan
              </Button>
              <Button
                type="button"
                size="sm"
                className="w-full justify-start gap-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 hover:border-purple-500/40 transition-smooth text-xs h-8"
                data-ocid="overview.quick_action.threat_feed_button"
              >
                <Activity className="w-3.5 h-3.5" />
                Check Threat Feed
              </Button>
              <Button
                type="button"
                size="sm"
                className="w-full justify-start gap-2 bg-white/[0.04] hover:bg-white/[0.07] text-muted-foreground border border-white/[0.06] hover:border-white/[0.12] transition-smooth text-xs h-8"
                data-ocid="overview.quick_action.generate_report_button"
              >
                <FileText className="w-3.5 h-3.5" />
                Generate Report
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
