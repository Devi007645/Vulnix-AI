import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Code2,
  Github,
  GraduationCap,
  Linkedin,
  Menu,
  MessageSquareWarning,
  Shield,
  Sparkles,
  Star,
  Target,
  Twitter,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

// ── Types ────────────────────────────────────────────────────────────────────
interface ServiceCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  stat: string;
  route: string;
  gradient: string;
  glowClass: string;
}

interface ThreatEvent {
  id: number;
  message: string;
  level: "critical" | "warning" | "info" | "success";
  time: string;
}

// ── Mock data ────────────────────────────────────────────────────────────────
const ROTATING_WORDS = [
  "Modern Teams",
  "Enterprise",
  "Bug Hunters",
  "Developers",
];

const TRUSTED_COMPANIES = [
  "NexaCorp",
  "HelixSec",
  "Orbita",
  "VaultLayer",
  "CipherTech",
  "StormAI",
];

const SERVICES: ServiceCard[] = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: "AI Vulnerability Scanner",
    description:
      "Scan any target for OWASP vulnerabilities, open ports, SSL issues, and misconfigs with AI-powered remediation.",
    stat: "2,847 scans today",
    route: "/app/scanner",
    gradient: "from-cyan-500/20 to-blue-500/10",
    glowClass: "group-hover:shadow-glow-cyan",
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Bug Bounty AI",
    description:
      "Automate reconnaissance, discover endpoints, extract parameters, and get AI-powered vulnerability hints.",
    stat: "1,203 targets active",
    route: "/app/bug-bounty",
    gradient: "from-purple-500/20 to-pink-500/10",
    glowClass: "group-hover:shadow-glow-purple",
  },
  {
    icon: <Code2 className="w-6 h-6" />,
    title: "Secure Code Review",
    description:
      "AI-powered static analysis for GitHub repos. Inline comments, security scores, and fix suggestions.",
    stat: "98% accuracy rate",
    route: "/app/code-review",
    gradient: "from-emerald-500/20 to-cyan-500/10",
    glowClass: "group-hover:shadow-glow-cyan",
  },
  {
    icon: <GraduationCap className="w-6 h-6" />,
    title: "Learning Arena",
    description:
      "Gamified ethical hacking labs, CTF challenges, skill trees, and an AI mentor to accelerate your learning.",
    stat: "50K+ learners",
    route: "/app/learning",
    gradient: "from-orange-500/20 to-yellow-500/10",
    glowClass: "group-hover:shadow-glow-purple",
  },
  {
    icon: <MessageSquareWarning className="w-6 h-6" />,
    title: "WhatsApp Scam Shield",
    description:
      "Detect scams, fraud, and phishing in WhatsApp messages with AI-powered analysis and confidence scoring.",
    stat: "99.2% detection rate",
    route: "/app/scam-detection",
    gradient: "from-rose-500/20 to-red-500/10",
    glowClass: "group-hover:shadow-glow-purple",
  },
];

const INITIAL_THREAT_EVENTS: ThreatEvent[] = [
  {
    id: 1,
    message: "Critical vulnerability detected on api.example.com",
    level: "critical",
    time: "0s ago",
  },
  {
    id: 2,
    message: "Recon agent completed subdomain scan for target #847",
    level: "success",
    time: "2s ago",
  },
  {
    id: 3,
    message: "SSL certificate expiry warning on cdn.helixsec.io",
    level: "warning",
    time: "5s ago",
  },
  {
    id: 4,
    message: "XSS vector identified in checkout flow (HIGH)",
    level: "critical",
    time: "8s ago",
  },
  {
    id: 5,
    message: "AI remediation report generated for NexaCorp",
    level: "info",
    time: "11s ago",
  },
  {
    id: 6,
    message: "Port scan completed — 3 open ports discovered",
    level: "info",
    time: "14s ago",
  },
];

const LIVE_EVENTS_POOL = [
  {
    message: "SQL injection attempt blocked on /api/users",
    level: "critical" as const,
  },
  { message: "New target added to bug bounty queue", level: "info" as const },
  {
    message: "AI agent completed threat analysis for Orbita",
    level: "success" as const,
  },
  {
    message: "Rate limiting triggered on auth endpoint",
    level: "warning" as const,
  },
  {
    message: "Code review scan completed — 12 findings",
    level: "warning" as const,
  },
  {
    message: "CVE-2025-1337 matched against active targets",
    level: "critical" as const,
  },
];

const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "CISO @ NexaCorp",
    initials: "SC",
    color: "bg-cyan-500/20 text-cyber-cyan",
    quote:
      "Vulnix AI has completely transformed how our security team operates. The AI remediation suggestions alone saved us 40+ hours per month.",
    stars: 5,
  },
  {
    name: "Marcus Rivera",
    role: "Bug Bounty Hunter",
    initials: "MR",
    color: "bg-purple-500/20 text-cyber-purple",
    quote:
      "The Bug Bounty AI module is insane. I found a critical RCE on day one using the automated recon workflows. Worth every penny.",
    stars: 5,
  },
  {
    name: "Priya Patel",
    role: "Lead Developer @ Orbita",
    initials: "PP",
    color: "bg-emerald-500/20 text-emerald-400",
    quote:
      "Secure Code Review integrated with our GitHub in under 10 minutes. The inline AI comments feel like having a senior security engineer in every PR.",
    stars: 5,
  },
];

const PRICING_PLANS = [
  {
    name: "Starter",
    price: 49,
    description: "Perfect for independent researchers and small teams",
    highlight: false,
    features: [
      "5 scans / month",
      "1 user seat",
      "Vulnerability Scanner",
      "Community support",
      "Basic reports",
    ],
  },
  {
    name: "Pro",
    price: 149,
    description: "Everything you need to run a world-class security operation",
    highlight: true,
    features: [
      "Unlimited scans",
      "5 user seats",
      "All 5 modules",
      "AI assistant",
      "Priority support",
      "Advanced reports",
      "API access",
    ],
  },
  {
    name: "Enterprise",
    price: null,
    description: "Custom deployment for large organizations and MSSPs",
    highlight: false,
    features: [
      "Unlimited everything",
      "Unlimited users",
      "SSO / SAML",
      "Audit logs",
      "Dedicated support",
      "SLA guarantee",
      "White-labeling",
    ],
  },
];

// ── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedCounter({
  target,
  suffix = "",
  prefix = "",
}: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const startTime = performance.now();
    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      start = Math.floor(eased * target);
      setCount(start);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// ── Threat Event Level colors ────────────────────────────────────────────────
const levelColor: Record<ThreatEvent["level"], string> = {
  critical: "bg-red-500",
  warning: "bg-orange-400",
  info: "bg-cyber-cyan",
  success: "bg-emerald-400",
};
const levelLabel: Record<ThreatEvent["level"], string> = {
  critical: "CRITICAL",
  warning: "WARNING",
  info: "INFO",
  success: "SUCCESS",
};
const levelTextColor: Record<ThreatEvent["level"], string> = {
  critical: "text-red-400",
  warning: "text-orange-400",
  info: "text-cyber-cyan",
  success: "text-emerald-400",
};

// ── Component ────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();
  const [wordIndex, setWordIndex] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [billingAnnual, setBillingAnnual] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [threatEvents, setThreatEvents] = useState<ThreatEvent[]>(
    INITIAL_THREAT_EVENTS,
  );
  const nextIdRef = useRef(INITIAL_THREAT_EVENTS.length + 1);
  const poolRef = useRef(0);

  // Rotating headline
  useEffect(() => {
    const id = setInterval(
      () => setWordIndex((i) => (i + 1) % ROTATING_WORDS.length),
      2600,
    );
    return () => clearInterval(id);
  }, []);

  // Scroll navbar
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Live threat feed
  useEffect(() => {
    const id = setInterval(() => {
      const event = LIVE_EVENTS_POOL[poolRef.current % LIVE_EVENTS_POOL.length];
      poolRef.current += 1;
      const newEvent: ThreatEvent = {
        id: nextIdRef.current++,
        message: event.message,
        level: event.level,
        time: "just now",
      };
      setThreatEvents((prev) => [newEvent, ...prev.slice(0, 5)]);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-x-hidden">
      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "glass border-b border-white/[0.08] shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
            data-ocid="nav.logo"
          >
            <div className="w-8 h-8 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center glow-cyan transition-smooth group-hover:bg-cyber-cyan/20">
              <Shield
                className="w-4.5 h-4.5 text-cyber-cyan"
                strokeWidth={2.5}
              />
            </div>
            <span className="font-bold text-lg tracking-tight">
              <span className="text-gradient-cyan">Vulnix</span>{" "}
              <span className="text-white">AI</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden md:flex items-center gap-7"
            aria-label="Main navigation"
          >
            {["Features", "Architecture", "Pricing", "Docs"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                data-ocid={`nav.${item.toLowerCase()}_link`}
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm text-white/70 hover:text-white transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-white/5"
              data-ocid="nav.login_link"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="text-sm font-medium px-4 py-2 rounded-lg bg-cyber-cyan text-[#0A0A0A] hover:bg-cyber-cyan/90 transition-smooth shadow-glow-sm-cyan"
              data-ocid="nav.register_button"
            >
              Start Free Trial
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="md:hidden p-2 text-white/60 hover:text-white"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            data-ocid="nav.mobile_menu_toggle"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden glass border-t border-white/[0.08] px-6 py-4 flex flex-col gap-4"
            >
              {["Features", "Architecture", "Pricing", "Docs"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm text-white/70"
                >
                  {item}
                </a>
              ))}
              <Link to="/login" className="text-sm text-white/70">
                Log In
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium px-4 py-2 rounded-lg bg-cyber-cyan text-[#0A0A0A] text-center"
              >
                Start Free Trial
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section
        id="features"
        className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-24 px-6 overflow-hidden cyber-grid"
        data-ocid="hero.section"
      >
        {/* Radial overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(6,182,212,0.15) 0%, rgba(139,92,246,0.08) 35%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyber-cyan/30 bg-cyber-cyan/5 text-cyber-cyan text-sm font-medium mb-8"
            data-ocid="hero.badge"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Security Platform
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-4"
          >
            The AI Security OS for
            <br />
            <span className="inline-block min-w-[14ch]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -16, filter: "blur(8px)" }}
                  transition={{ duration: 0.4 }}
                  className="text-gradient-cyan inline-block"
                >
                  {ROTATING_WORDS[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-white/55 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Vulnix AI unifies vulnerability scanning, bug bounty, code review,
            and threat intelligence into one intelligent platform.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <button
              type="button"
              onClick={() => navigate({ to: "/register" })}
              className="group flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-[#0A0A0A] bg-gradient-to-r from-cyber-cyan to-blue-500 hover:from-cyber-cyan/90 hover:to-blue-500/90 transition-smooth shadow-glow-cyan text-sm"
              data-ocid="hero.cta_primary"
            >
              Start Free Trial
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              type="button"
              className="px-6 py-3.5 rounded-xl font-semibold text-white/80 border border-white/[0.12] hover:border-white/25 hover:bg-white/5 transition-smooth text-sm"
              data-ocid="hero.cta_secondary"
            >
              Book a Demo
            </button>
          </motion.div>

          {/* Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto"
            data-ocid="hero.metrics"
          >
            {[
              {
                label: "Threats Blocked",
                value: 2400000,
                suffix: "+",
                prefix: "",
              },
              {
                label: "Vulnerabilities Scanned",
                value: 847000,
                suffix: "",
                prefix: "",
              },
              { label: "AI Analyses", value: 1200000, suffix: "+", prefix: "" },
            ].map((m, i) => (
              <div
                key={m.label}
                className="glass rounded-xl px-5 py-4 border border-white/[0.07]"
                data-ocid={`hero.metric.${i + 1}`}
              >
                <p className="text-2xl font-bold text-gradient-cyan">
                  <AnimatedCounter
                    target={m.value}
                    suffix={m.suffix}
                    prefix={m.prefix}
                  />
                </p>
                <p className="text-xs text-white/45 mt-1">{m.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Dashboard preview card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="relative z-10 mt-16 max-w-4xl w-full mx-auto animate-float"
          data-ocid="hero.preview_card"
        >
          <div className="glass rounded-2xl border border-white/[0.08] overflow-hidden shadow-2xl">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-orange-400/70" />
              <div className="w-3 h-3 rounded-full bg-emerald-400/70" />
              <span className="ml-2 text-xs text-white/30 font-mono">
                vulnix.ai/dashboard
              </span>
            </div>
            <img
              src="/assets/generated/hero-dashboard-preview.dim_1200x800.jpg"
              alt="Vulnix AI dashboard preview"
              className="w-full object-cover opacity-80"
              style={{ maxHeight: 340 }}
            />
          </div>
          {/* Subtle glow under card */}
          <div
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-2/3 h-16 rounded-full blur-2xl pointer-events-none"
            style={{ background: "rgba(6,182,212,0.12)" }}
          />
        </motion.div>
      </section>

      {/* ── TRUSTED BY ─────────────────────────────────────────────────────── */}
      <section
        className="py-14 px-6 border-y border-white/[0.05]"
        data-ocid="trusted.section"
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/10" />
            <p className="text-xs text-white/35 font-medium tracking-widest uppercase text-center whitespace-nowrap">
              Trusted by security teams at leading companies
            </p>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/10" />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 mt-8">
            {TRUSTED_COMPANIES.map((name) => (
              <span
                key={name}
                className="text-sm font-semibold text-white/25 tracking-wide hover:text-white/50 transition-colors duration-300"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCT ECOSYSTEM ──────────────────────────────────────────────── */}
      <section
        id="features"
        className="py-24 px-6"
        data-ocid="ecosystem.section"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-xs text-cyber-cyan font-semibold tracking-widest uppercase mb-4">
              Platform
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-5">
              One Platform,{" "}
              <span className="text-gradient-purple">Five Superpowers</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto text-sm leading-relaxed">
              Each module runs as an independent microservice — fully integrated
              into a single unified security workspace.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((svc, i) => (
              <motion.div
                key={svc.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                onClick={() => navigate({ to: svc.route as "/app/scanner" })}
                className={`group relative glass rounded-2xl p-6 cursor-pointer hover-lift border border-white/[0.07] hover:border-white/[0.14] transition-smooth ${svc.glowClass}`}
                data-ocid={`ecosystem.card.${i + 1}`}
              >
                {/* Icon */}
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${svc.gradient} flex items-center justify-center mb-5 border border-white/[0.08]`}
                >
                  <span className="text-cyber-cyan">{svc.icon}</span>
                </div>
                <h3 className="font-semibold text-[15px] text-white mb-2">
                  {svc.title}
                </h3>
                <p className="text-xs text-white/45 leading-relaxed mb-5">
                  {svc.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-cyber-cyan/70 bg-cyber-cyan/5 px-2.5 py-1 rounded-full border border-cyber-cyan/10">
                    {svc.stat}
                  </span>
                  <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-cyber-cyan group-hover:translate-x-1 transition-all duration-200" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI INTELLIGENCE ────────────────────────────────────────────────── */}
      <section
        className="py-24 px-6 bg-[#0D0D0D]"
        data-ocid="intelligence.section"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-xs text-cyber-purple font-semibold tracking-widest uppercase mb-4">
              Multi-Agent AI
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Intelligence at{" "}
              <span className="text-gradient-purple">Every Layer</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Left: agents */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-white/55 text-sm leading-relaxed mb-8">
                Vulnix AI deploys specialized AI agents that collaborate across
                the platform in real-time — each designed for a specific threat
                domain.
              </p>
              <div className="space-y-4">
                {[
                  {
                    name: "Recon Agent",
                    desc: "Automated subdomain discovery, port scanning, and attack surface mapping.",
                    color: "text-cyber-cyan",
                    bg: "bg-cyber-cyan/10",
                    border: "border-cyber-cyan/20",
                  },
                  {
                    name: "Threat Agent",
                    desc: "CVE correlation, exploit chain analysis, and real-time threat scoring.",
                    color: "text-cyber-purple",
                    bg: "bg-cyber-purple/10",
                    border: "border-cyber-purple/20",
                  },
                  {
                    name: "Remediation Agent",
                    desc: "AI-generated fix suggestions, secure code alternatives, and patch guides.",
                    color: "text-emerald-400",
                    bg: "bg-emerald-500/10",
                    border: "border-emerald-500/20",
                  },
                  {
                    name: "Report Agent",
                    desc: "Auto-generate executive and technical reports with full remediation plans.",
                    color: "text-orange-400",
                    bg: "bg-orange-500/10",
                    border: "border-orange-500/20",
                  },
                ].map((agent, i) => (
                  <motion.div
                    key={agent.name}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className={`flex items-start gap-4 p-4 rounded-xl ${agent.bg} border ${agent.border}`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${agent.bg} border-2 ${agent.border}`}
                    />
                    <div>
                      <p className={`font-semibold text-sm ${agent.color}`}>
                        {agent.name}
                      </p>
                      <p className="text-white/45 text-xs mt-0.5 leading-relaxed">
                        {agent.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right: live feed */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="glass rounded-2xl border border-white/[0.08] overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-glow" />
                  <span className="text-xs font-semibold text-white/70">
                    Live Threat Feed
                  </span>
                </div>
                <span className="text-[10px] font-mono text-white/30">
                  REALTIME
                </span>
              </div>
              <div className="p-4 space-y-2.5 min-h-[320px]">
                <AnimatePresence initial={false}>
                  {threatEvents.slice(0, 6).map((evt) => (
                    <motion.div
                      key={evt.id}
                      initial={{ opacity: 0, x: 20, scale: 0.97 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -20, scale: 0.97 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.025] border border-white/[0.04]"
                      data-ocid={`threat_feed.item.${evt.id}`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${levelColor[evt.level]}`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white/70 leading-snug truncate">
                          {evt.message}
                        </p>
                        <p
                          className={`text-[10px] font-mono mt-0.5 ${levelTextColor[evt.level]}`}
                        >
                          {levelLabel[evt.level]} · {evt.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── ARCHITECTURE ───────────────────────────────────────────────────── */}
      <section
        id="architecture"
        className="py-24 px-6"
        data-ocid="architecture.section"
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-xs text-cyber-cyan font-semibold tracking-widest uppercase mb-4">
              Infrastructure
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Enterprise{" "}
              <span className="text-gradient-cyan">
                Microservices Architecture
              </span>
            </h2>
            <p className="text-white/45 max-w-lg mx-auto text-sm leading-relaxed mt-4">
              Each service scales independently — containerized, event-driven,
              and Kubernetes-ready.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="glass rounded-2xl border border-white/[0.08] p-8"
          >
            {/* Grid layout: 3 cols × 4 rows */}
            <div className="grid grid-cols-3 gap-5">
              {/* Row 1: API Gateway centered */}
              <div className="col-span-3 flex justify-center">
                <ArchNode label="API Gateway" color="cyan" pulse />
              </div>

              {/* Row 1 connector line */}
              <div className="col-span-3 flex justify-center -mt-2 mb-1">
                <div className="w-px h-5 border-l border-dashed border-cyber-cyan/30" />
              </div>

              {/* Row 2 */}
              <div className="flex justify-center">
                <ArchNode label="Auth Service" color="cyan" />
              </div>
              <div className="flex justify-center">
                <ArchNode label="AI Engine" color="purple" glow />
              </div>
              <div className="flex justify-center">
                <ArchNode label="Scanner Service" color="cyan" />
              </div>

              {/* Row 2→3 connectors */}
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex justify-center -my-1">
                  <div className="w-px h-5 border-l border-dashed border-white/15" />
                </div>
              ))}

              {/* Row 3 */}
              <div className="flex justify-center">
                <ArchNode label="Bug Bounty" color="gray" />
              </div>
              <div className="flex justify-center">
                <ArchNode label="Code Analysis" color="gray" />
              </div>
              <div className="flex justify-center">
                <ArchNode label="Learning Engine" color="gray" />
              </div>

              {/* Row 3→4 connectors */}
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex justify-center -my-1">
                  <div className="w-px h-5 border-l border-dashed border-white/15" />
                </div>
              ))}

              {/* Row 4 */}
              <div className="flex justify-center">
                <ArchNode label="Scam Detection" color="purple" />
              </div>
              <div className="flex justify-center">
                <ArchNode label="Notifications" color="gray" />
              </div>
              <div className="flex justify-center">
                <ArchNode label="Analytics" color="cyan" />
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-6 border-t border-white/[0.06]">
              {[
                { color: "bg-cyber-cyan", label: "Core Services" },
                { color: "bg-cyber-purple", label: "AI Services" },
                { color: "bg-white/30", label: "Support Services" },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
                  <span className="text-xs text-white/40">{l.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────────────────────────────── */}
      <section
        id="pricing"
        className="py-24 px-6 bg-[#0D0D0D]"
        data-ocid="pricing.section"
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6 }}
            className="text-center mb-5"
          >
            <p className="text-xs text-cyber-purple font-semibold tracking-widest uppercase mb-4">
              Pricing
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-5">
              Simple,{" "}
              <span className="text-gradient-purple">Transparent Pricing</span>
            </h2>
          </motion.div>

          {/* Billing toggle */}
          <div
            className="flex items-center justify-center gap-4 mb-12"
            data-ocid="pricing.billing_toggle"
          >
            <span
              className={`text-sm ${!billingAnnual ? "text-white" : "text-white/40"}`}
            >
              Monthly
            </span>
            <button
              type="button"
              onClick={() => setBillingAnnual((v) => !v)}
              className={`relative w-12 h-6 rounded-full transition-smooth ${
                billingAnnual ? "bg-cyber-cyan" : "bg-white/10"
              }`}
              aria-label="Toggle billing period"
              data-ocid="pricing.billing_toggle_switch"
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                  billingAnnual ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
            <span
              className={`text-sm ${billingAnnual ? "text-white" : "text-white/40"}`}
            >
              Annual{" "}
              <span className="text-cyber-cyan text-xs font-semibold">
                -20%
              </span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING_PLANS.map((plan, i) => {
              const price = plan.price
                ? billingAnnual
                  ? Math.round(plan.price * 0.8)
                  : plan.price
                : null;
              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`relative rounded-2xl p-7 flex flex-col ${
                    plan.highlight
                      ? "border-2 border-cyber-cyan/50 bg-[#0F1A1C] shadow-glow-cyan"
                      : "glass border border-white/[0.07]"
                  }`}
                  data-ocid={`pricing.card.${i + 1}`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-cyber-cyan text-[#0A0A0A] text-xs font-bold">
                      Most Popular
                    </div>
                  )}
                  <p className="font-bold text-lg mb-1">{plan.name}</p>
                  <p className="text-xs text-white/40 mb-6 leading-relaxed">
                    {plan.description}
                  </p>
                  <div className="mb-7">
                    {price !== null ? (
                      <>
                        <span className="text-4xl font-bold">${price}</span>
                        <span className="text-white/40 text-sm">/month</span>
                      </>
                    ) : (
                      <span className="text-3xl font-bold">Custom</span>
                    )}
                  </div>
                  <ul className="space-y-2.5 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5">
                        <Check className="w-3.5 h-3.5 text-cyber-cyan flex-shrink-0" />
                        <span className="text-xs text-white/60">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => navigate({ to: "/register" })}
                    className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-smooth ${
                      plan.highlight
                        ? "bg-cyber-cyan text-[#0A0A0A] hover:bg-cyber-cyan/90"
                        : "border border-white/10 text-white/70 hover:border-white/20 hover:bg-white/5"
                    }`}
                    data-ocid={`pricing.cta_button.${i + 1}`}
                  >
                    {plan.price === null ? "Contact Sales" : "Get Started"}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────────────────────── */}
      <section className="py-24 px-6" data-ocid="testimonials.section">
        <div className="max-w-6xl mx-auto">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p className="text-xs text-cyber-cyan font-semibold tracking-widest uppercase mb-4">
              Social Proof
            </p>
            <h2 className="text-3xl font-bold">
              Trusted by{" "}
              <span className="text-gradient-cyan">Security Professionals</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass rounded-2xl p-6 border border-white/[0.07] hover-lift transition-smooth"
                data-ocid={`testimonials.card.${i + 1}`}
              >
                <div className="flex gap-0.5 mb-5">
                  {[1, 2, 3, 4, 5].slice(0, t.stars).map((n) => (
                    <Star
                      key={n}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-sm text-white/65 leading-relaxed mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${t.color}`}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-white/40">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-6" data-ocid="cta.section">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl p-12 text-center border border-cyber-cyan/20"
            style={{
              background:
                "linear-gradient(135deg, rgba(6,182,212,0.08) 0%, rgba(10,10,10,0.95) 50%, rgba(139,92,246,0.08) 100%)",
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(6,182,212,0.06), transparent 70%)",
              }}
            />
            <div className="relative z-10">
              <div className="flex justify-center mb-5">
                <div className="w-14 h-14 rounded-2xl bg-cyber-cyan/10 border border-cyber-cyan/25 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-cyber-cyan" />
                </div>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to secure your{" "}
                <span className="text-gradient-cyan">
                  digital infrastructure?
                </span>
              </h2>
              <p className="text-white/50 mb-9 max-w-md mx-auto text-sm leading-relaxed">
                Join thousands of security professionals who trust Vulnix AI to
                protect their most critical assets.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => navigate({ to: "/register" })}
                  className="px-8 py-3.5 rounded-xl font-semibold text-[#0A0A0A] bg-cyber-cyan hover:bg-cyber-cyan/90 transition-smooth shadow-glow-sm-cyan text-sm"
                  data-ocid="cta.get_started_button"
                >
                  Get Started Free
                </button>
                <button
                  type="button"
                  className="px-8 py-3.5 rounded-xl font-semibold border border-white/10 text-white/70 hover:border-white/20 hover:bg-white/5 transition-smooth text-sm"
                  data-ocid="cta.contact_sales_button"
                >
                  Contact Sales
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer
        className="border-t border-white/[0.06] bg-[#0A0A0A] pt-14 pb-8 px-6"
        data-ocid="footer.section"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center">
                  <Shield className="w-3.5 h-3.5 text-cyber-cyan" />
                </div>
                <span className="font-bold text-base">
                  <span className="text-gradient-cyan">Vulnix</span> AI
                </span>
              </div>
              <p className="text-xs text-white/35 leading-relaxed">
                The AI Security OS for modern security teams.
              </p>
            </div>

            {/* Links */}
            {[
              {
                title: "Product",
                links: [
                  "Vulnerability Scanner",
                  "Bug Bounty AI",
                  "Code Review",
                  "Learning Arena",
                  "Scam Shield",
                ],
              },
              {
                title: "Company",
                links: ["About", "Blog", "Careers", "Press"],
              },
              {
                title: "Resources",
                links: [
                  "Documentation",
                  "API Reference",
                  "Changelog",
                  "Status",
                ],
              },
              {
                title: "Legal",
                links: [
                  "Privacy Policy",
                  "Terms of Service",
                  "Security",
                  "Cookies",
                ],
              },
            ].map((col) => (
              <div key={col.title}>
                <p className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-4">
                  {col.title}
                </p>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="/"
                        className="text-xs text-white/35 hover:text-white/70 transition-colors duration-200"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/[0.05]">
            <p className="text-xs text-white/30">
              © {new Date().getFullYear()} Vulnix AI. All rights reserved.{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white/50 transition-colors duration-200"
              >
                Built with love using caffeine.ai
              </a>
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: <Github className="w-4 h-4" />, label: "GitHub" },
                { icon: <Twitter className="w-4 h-4" />, label: "Twitter" },
                { icon: <Linkedin className="w-4 h-4" />, label: "LinkedIn" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={
                    s.label === "GitHub"
                      ? "https://github.com"
                      : s.label === "Twitter"
                        ? "https://twitter.com"
                        : "https://linkedin.com"
                  }
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="text-white/30 hover:text-white/70 transition-colors duration-200"
                  data-ocid={`footer.${s.label.toLowerCase()}_link`}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ── Architecture Node ────────────────────────────────────────────────────────
function ArchNode({
  label,
  color,
  glow = false,
  pulse = false,
}: {
  label: string;
  color: "cyan" | "purple" | "gray";
  glow?: boolean;
  pulse?: boolean;
}) {
  const colorMap = {
    cyan: {
      border: "border-cyber-cyan/35",
      bg: "bg-cyber-cyan/8",
      text: "text-cyber-cyan",
      dot: "bg-cyber-cyan",
      shadow: glow ? "shadow-glow-sm-cyan" : "",
    },
    purple: {
      border: "border-cyber-purple/35",
      bg: "bg-cyber-purple/8",
      text: "text-cyber-purple",
      dot: "bg-cyber-purple",
      shadow: glow ? "shadow-glow-purple" : "",
    },
    gray: {
      border: "border-white/10",
      bg: "bg-white/[0.03]",
      text: "text-white/60",
      dot: "bg-white/30",
      shadow: "",
    },
  };
  const c = colorMap[color];
  return (
    <div
      className={`relative flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl border ${c.border} ${c.shadow} min-w-[110px] text-center`}
      style={{
        background:
          color === "cyan"
            ? "rgba(6,182,212,0.05)"
            : color === "purple"
              ? "rgba(139,92,246,0.05)"
              : "rgba(255,255,255,0.02)",
      }}
    >
      <div
        className={`w-1.5 h-1.5 rounded-full ${c.dot} ${pulse ? "animate-pulse-glow" : ""}`}
      />
      <span className={`text-[11px] font-medium ${c.text} leading-tight`}>
        {label}
      </span>
    </div>
  );
}
