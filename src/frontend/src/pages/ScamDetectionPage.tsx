import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  FileWarning,
  Link,
  MessageSquareWarning,
  Search,
  Share2,
  Shield,
  ShieldAlert,
  Sparkles,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
type ThreatLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "SAFE";

interface Conversation {
  id: string;
  contact: string;
  preview: string;
  time: string;
  threat: ThreatLevel;
  unread: number;
}

interface ChatMessage {
  id: string;
  sender: "them" | "me";
  text: string;
  time: string;
}

interface ThreatIndicator {
  id: string;
  safe: boolean;
  label: string;
}

// ── Mock data ─────────────────────────────────────────────────────────────────
const CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    contact: "Unknown +1 (555) 0247",
    preview: "URGENT: Your account has been compromised...",
    time: "2:34 PM",
    threat: "CRITICAL",
    unread: 3,
  },
  {
    id: "c2",
    contact: "Crypto Investment Bot",
    preview: "Congratulations! You've been selected for...",
    time: "1:12 PM",
    threat: "HIGH",
    unread: 1,
  },
  {
    id: "c3",
    contact: "+44 7700 900123",
    preview: "Hi, I'm from Microsoft Support. Your computer...",
    time: "11:45 AM",
    threat: "HIGH",
    unread: 2,
  },
  {
    id: "c4",
    contact: "Prize Winner Alert",
    preview: "You've won $50,000! Click here to claim...",
    time: "Yesterday",
    threat: "CRITICAL",
    unread: 0,
  },
];

const CHAT_MESSAGES: ChatMessage[] = [
  {
    id: "m1",
    sender: "them",
    text: "Hello, this is the Security Department at Chase Bank.",
    time: "2:28 PM",
  },
  {
    id: "m2",
    sender: "them",
    text: "We have detected suspicious activity on your account #****4892.",
    time: "2:29 PM",
  },
  {
    id: "m3",
    sender: "them",
    text: "To prevent your account from being suspended, you must verify your identity IMMEDIATELY.",
    time: "2:30 PM",
  },
  {
    id: "m4",
    sender: "them",
    text: "Please provide your: Full name, Date of birth, Social Security Number, Card number and CVV",
    time: "2:31 PM",
  },
  {
    id: "m5",
    sender: "them",
    text: "This is URGENT. Failure to respond within 30 minutes will result in account freeze.",
    time: "2:34 PM",
  },
];

const INDICATORS: ThreatIndicator[] = [
  { id: "i1", safe: false, label: "Bank impersonation detected" },
  { id: "i2", safe: false, label: "Urgency manipulation tactics" },
  {
    id: "i3",
    safe: false,
    label: "Requesting sensitive personal data (SSN, card number)",
  },
  { id: "i4", safe: false, label: 'Threatening language ("account freeze")' },
  { id: "i5", safe: false, label: "Phone number not matching bank records" },
  { id: "i6", safe: false, label: "Grammar inconsistencies detected" },
  {
    id: "i7",
    safe: true,
    label: "No official bank domain detected in message",
  },
];

// ── Helper components ─────────────────────────────────────────────────────────
function threatColor(level: ThreatLevel): string {
  if (level === "CRITICAL") return "#ef4444";
  if (level === "HIGH") return "#f97316";
  if (level === "MEDIUM") return "#eab308";
  return "#22c55e";
}

function ThreatBadge({ level }: { level: ThreatLevel }) {
  const colors: Record<ThreatLevel, string> = {
    CRITICAL: "bg-red-500/15 text-red-400 border-red-500/30",
    HIGH: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    MEDIUM: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    SAFE: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider border ${
        colors[level]
      }`}
    >
      {level}
    </span>
  );
}

function AvatarCircle({
  contact,
  threat,
}: { contact: string; threat: ThreatLevel }) {
  const initials = contact
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const color = threatColor(threat);
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
      style={{ background: `${color}33`, border: `1.5px solid ${color}55` }}
    >
      <span style={{ color }}>{initials}</span>
    </div>
  );
}

// ── Threat score ring ─────────────────────────────────────────────────────────
function ThreatScoreRing({ score }: { score: number }) {
  const radius = 52;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: 136, height: 136 }}
    >
      <svg
        width={136}
        height={136}
        role="img"
        aria-label="Scam probability score ring"
        style={{ position: "absolute", transform: "rotate(-90deg)" }}
      >
        <circle
          cx={68}
          cy={68}
          r={radius}
          fill="none"
          stroke="rgba(239,68,68,0.12)"
          strokeWidth={10}
        />
        <motion.circle
          cx={68}
          cy={68}
          r={radius}
          fill="none"
          stroke="#ef4444"
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: "easeOut", delay: 0.3 }}
          style={{ filter: "drop-shadow(0 0 6px #ef4444aa)" }}
        />
      </svg>
      <div className="flex flex-col items-center z-10">
        <span className="text-3xl font-black text-red-400 leading-none">
          {score}%
        </span>
        <span className="text-[9px] font-bold tracking-widest text-red-400/70 mt-0.5 uppercase">
          Scam Prob.
        </span>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ScamDetectionPage() {
  const [selectedId, setSelectedId] = useState<string>("c1");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = CONVERSATIONS.filter(
    (c) =>
      c.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.preview.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const selected =
    CONVERSATIONS.find((c) => c.id === selectedId) ?? CONVERSATIONS[0];

  return (
    <div className="flex flex-col h-full min-h-screen bg-background">
      {/* ── Page header ─────────────────────────────────────────────────────── */}
      <div
        className="flex-shrink-0 border-b"
        style={{ borderColor: "rgba(255,255,255,0.07)", background: "#111111" }}
      >
        <div className="px-6 pt-5 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    background: "rgba(6,182,212,0.12)",
                    border: "1px solid rgba(6,182,212,0.25)",
                  }}
                >
                  <MessageSquareWarning
                    className="w-4 h-4"
                    style={{ color: "#06B6D4" }}
                  />
                </div>
                <h1 className="text-xl font-bold text-foreground tracking-tight">
                  Scam Detection AI
                </h1>
              </div>
              <p className="text-sm text-muted-foreground ml-10">
                AI-powered analysis of suspicious messages and conversations
              </p>
            </div>
            <Button
              data-ocid="scam.analyze_new_button"
              className="flex-shrink-0 mt-0.5"
              style={{
                background: "rgba(6,182,212,0.15)",
                border: "1px solid rgba(6,182,212,0.4)",
                color: "#06B6D4",
              }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Analyze New Message
            </Button>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-6 mt-4 ml-10">
            {[
              { label: "messages analyzed", value: "1,247", icon: Shield },
              {
                label: "scam detection rate",
                value: "94.3%",
                icon: ShieldAlert,
              },
              {
                label: "threats blocked today",
                value: "23",
                icon: AlertTriangle,
              },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                <span
                  className="text-sm font-semibold"
                  style={{ color: "#06B6D4" }}
                >
                  {value}
                </span>
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Three-column body ──────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT — Chat list */}
        <div
          className="flex flex-col flex-shrink-0 border-r overflow-hidden"
          style={{
            width: "28%",
            borderColor: "rgba(255,255,255,0.07)",
            background: "#0d0d0d",
          }}
        >
          {/* List header + search */}
          <div
            className="px-4 pt-4 pb-3 border-b flex-shrink-0"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-foreground">
                Conversations
              </span>
              <span className="text-xs text-muted-foreground">
                {CONVERSATIONS.length}
              </span>
            </div>
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <Search className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              <input
                data-ocid="scam.search_input"
                className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none"
                placeholder="Search conversations…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Conversation items */}
          <div className="flex-1 overflow-y-auto">
            {filtered.map((conv, idx) => {
              const isSelected = conv.id === selectedId;
              return (
                <motion.button
                  key={conv.id}
                  data-ocid={`scam.conversation.item.${idx + 1}`}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.06, duration: 0.3 }}
                  onClick={() => setSelectedId(conv.id)}
                  className="w-full text-left px-4 py-3 transition-colors relative"
                  style={{
                    background: isSelected
                      ? "rgba(6,182,212,0.06)"
                      : "transparent",
                    borderLeft: isSelected
                      ? "2.5px solid #06B6D4"
                      : "2.5px solid transparent",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <AvatarCircle contact={conv.contact} threat={conv.threat} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-xs font-semibold text-foreground truncate">
                          {conv.contact}
                        </span>
                        <span className="text-[10px] text-muted-foreground flex-shrink-0">
                          {conv.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate mb-1.5">
                        {conv.preview}
                      </p>
                      <div className="flex items-center justify-between">
                        <ThreatBadge level={conv.threat} />
                        {conv.unread > 0 && (
                          <span
                            className="w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white"
                            style={{ background: "#06B6D4" }}
                          >
                            {conv.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* MIDDLE — Chat view */}
        <div
          className="flex flex-col flex-1 overflow-hidden"
          style={{ background: "#0A0A0A" }}
        >
          {/* Chat header */}
          <div
            className="flex items-center justify-between px-5 py-3.5 border-b flex-shrink-0"
            style={{
              borderColor: "rgba(255,255,255,0.07)",
              background: "#111111",
            }}
          >
            <div className="flex items-center gap-3">
              <AvatarCircle
                contact={selected.contact}
                threat={selected.threat}
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    {selected.contact}
                  </span>
                  <ThreatBadge level={selected.threat} />
                </div>
                <span className="text-[11px] text-muted-foreground">
                  {CHAT_MESSAGES.length} messages • Last active {selected.time}
                </span>
              </div>
            </div>
            <Button
              data-ocid="scam.analyze_chat_button"
              size="sm"
              style={{
                background: "rgba(6,182,212,0.12)",
                border: "1px solid rgba(6,182,212,0.3)",
                color: "#06B6D4",
                fontSize: "12px",
              }}
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Analyze
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-3">
            <AnimatePresence>
              {CHAT_MESSAGES.map((msg, idx) => (
                <motion.div
                  key={msg.id}
                  data-ocid={`scam.message.item.${idx + 1}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.07, duration: 0.3 }}
                  className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className="max-w-[75%]"
                    style={{
                      background:
                        msg.sender === "me"
                          ? "rgba(6,182,212,0.18)"
                          : "rgba(255,255,255,0.06)",
                      border:
                        msg.sender === "me"
                          ? "1px solid rgba(6,182,212,0.3)"
                          : "1px solid rgba(255,255,255,0.08)",
                      borderRadius:
                        msg.sender === "me"
                          ? "20px 20px 4px 20px"
                          : "20px 20px 20px 4px",
                      padding: "10px 14px",
                    }}
                  >
                    <p className="text-sm text-foreground leading-relaxed">
                      {msg.text}
                    </p>
                    <p
                      className="text-[10px] mt-1.5"
                      style={{
                        color: "rgba(255,255,255,0.35)",
                        textAlign: msg.sender === "me" ? "right" : "left",
                      }}
                    >
                      {msg.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Scan bar + actions */}
          <div
            className="flex-shrink-0 border-t px-5 py-3"
            style={{
              borderColor: "rgba(255,255,255,0.07)",
              background: "#111111",
            }}
          >
            <div
              className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg"
              style={{
                background: "rgba(6,182,212,0.06)",
                border: "1px solid rgba(6,182,212,0.15)",
              }}
            >
              <CheckCircle2
                className="w-3.5 h-3.5 flex-shrink-0"
                style={{ color: "#06B6D4" }}
              />
              <span className="text-xs" style={{ color: "#06B6D4" }}>
                Scanned by Vulnix AI ✓ — Threat detected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                data-ocid="scam.report_scam_button"
                size="sm"
                className="flex-1 text-xs"
                style={{
                  background: "rgba(239,68,68,0.12)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  color: "#f87171",
                }}
              >
                <FileWarning className="w-3.5 h-3.5 mr-1.5" />
                Report as Scam
              </Button>
              <Button
                data-ocid="scam.mark_safe_button"
                size="sm"
                className="flex-1 text-xs"
                style={{
                  background: "rgba(34,197,94,0.08)",
                  border: "1px solid rgba(34,197,94,0.25)",
                  color: "#4ade80",
                }}
              >
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                Mark Safe
              </Button>
            </div>
          </div>
        </div>

        {/* RIGHT — AI Analysis Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col flex-shrink-0 border-l overflow-y-auto"
          style={{
            width: "28%",
            borderColor: "rgba(255,255,255,0.07)",
            background: "#0d0d0d",
          }}
        >
          {/* Panel header */}
          <div
            className="px-5 py-4 border-b flex-shrink-0"
            style={{ borderColor: "rgba(255,255,255,0.07)" }}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" style={{ color: "#06B6D4" }} />
              <span className="text-sm font-semibold text-foreground">
                AI Analysis
              </span>
            </div>
          </div>

          <div className="px-5 py-5 space-y-6">
            {/* Threat score */}
            <div
              className="rounded-xl p-4 flex flex-col items-center"
              style={{
                background: "rgba(239,68,68,0.05)",
                border: "1px solid rgba(239,68,68,0.15)",
              }}
            >
              <ThreatScoreRing score={97} />
              <div className="mt-3 flex flex-col items-center gap-2">
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 0px #ef4444",
                      "0 0 10px #ef444455",
                      "0 0 0px #ef4444",
                    ],
                  }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                  className="px-3 py-1 rounded-full text-xs font-bold tracking-widest"
                  style={{
                    background: "rgba(239,68,68,0.18)",
                    border: "1px solid rgba(239,68,68,0.4)",
                    color: "#f87171",
                  }}
                >
                  CRITICAL THREAT
                </motion.div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground">
                    Confidence:
                  </span>
                  <span
                    className="text-xs font-bold"
                    style={{ color: "#ef4444" }}
                  >
                    99.2%
                  </span>
                </div>
              </div>
            </div>

            {/* Indicators */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Threat Indicators
              </h3>
              <div className="space-y-2">
                {INDICATORS.map((ind, idx) => (
                  <motion.div
                    key={ind.id}
                    data-ocid={`scam.indicator.item.${idx + 1}`}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + idx * 0.07, duration: 0.3 }}
                    className="flex items-start gap-2.5 p-2.5 rounded-lg"
                    style={{
                      background: ind.safe
                        ? "rgba(34,197,94,0.05)"
                        : "rgba(239,68,68,0.05)",
                      border: ind.safe
                        ? "1px solid rgba(34,197,94,0.12)"
                        : "1px solid rgba(239,68,68,0.12)",
                    }}
                  >
                    {ind.safe ? (
                      <CheckCircle2
                        className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
                        style={{ color: "#22c55e" }}
                      />
                    ) : (
                      <XCircle
                        className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
                        style={{ color: "#ef4444" }}
                      />
                    )}
                    <span
                      className="text-xs leading-relaxed"
                      style={{ color: ind.safe ? "#86efac" : "#fca5a5" }}
                    >
                      {ind.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Link analysis */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Link Analysis
              </h3>
              <div
                className="flex items-center gap-2.5 p-3 rounded-lg"
                style={{
                  background: "rgba(34,197,94,0.05)",
                  border: "1px solid rgba(34,197,94,0.15)",
                }}
              >
                <Link
                  className="w-3.5 h-3.5 flex-shrink-0"
                  style={{ color: "#22c55e" }}
                />
                <span className="text-xs" style={{ color: "#86efac" }}>
                  No links detected in this message
                </span>
              </div>
            </div>

            {/* AI Explanation */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                AI Explanation
              </h3>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="p-3.5 rounded-lg"
                style={{
                  background: "rgba(6,182,212,0.05)",
                  border: "1px solid rgba(6,182,212,0.15)",
                }}
              >
                <div className="flex items-start gap-2">
                  <Sparkles
                    className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
                    style={{ color: "#06B6D4" }}
                  />
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.7)" }}
                  >
                    This message exhibits multiple high-confidence indicators of
                    a phone vishing (voice phishing) scam. The sender
                    impersonates Chase Bank, employs urgency and fear tactics,
                    and explicitly requests sensitive personal information
                    including SSN and card details — which no legitimate
                    financial institution would ever do via text.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Quick actions */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Button
                  data-ocid="scam.block_contact_button"
                  size="sm"
                  className="w-full justify-start text-xs"
                  style={{
                    background: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    color: "#f87171",
                  }}
                >
                  <Ban className="w-3.5 h-3.5 mr-2" />
                  Block Contact
                </Button>
                <Button
                  data-ocid="scam.report_authorities_button"
                  size="sm"
                  className="w-full justify-start text-xs"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  <FileWarning className="w-3.5 h-3.5 mr-2" />
                  Report to Authorities
                </Button>
                <Button
                  data-ocid="scam.share_warning_button"
                  size="sm"
                  className="w-full justify-start text-xs"
                  style={{
                    background: "rgba(6,182,212,0.12)",
                    border: "1px solid rgba(6,182,212,0.35)",
                    color: "#06B6D4",
                  }}
                >
                  <Share2 className="w-3.5 h-3.5 mr-2" />
                  Share Warning
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
