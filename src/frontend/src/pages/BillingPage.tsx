import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Activity,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  CreditCard,
  Download,
  Infinity as InfinityIcon,
  MessageSquare,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.28,
    ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    delay,
  },
});

// ── Usage meters ──────────────────────────────────────────────────────────────
const usageItems = [
  {
    icon: Activity,
    label: "API Calls",
    used: 2847,
    limit: 10000,
    pct: 28.5,
    display: "2,847 / 10,000",
    color: "bg-primary",
    unlimited: false,
  },
  {
    icon: Zap,
    label: "Vulnerability Scans",
    used: 23,
    limit: null,
    pct: null,
    display: "23 scans this period",
    color: "bg-chart-3",
    unlimited: true,
  },
  {
    icon: MessageSquare,
    label: "AI Chat Messages",
    used: 156,
    limit: 500,
    pct: 31.2,
    display: "156 / 500",
    color: "bg-secondary",
    unlimited: false,
  },
  {
    icon: Users,
    label: "Team Members",
    used: 3,
    limit: 5,
    pct: 60,
    display: "3 / 5 seats",
    color: "bg-chart-1",
    unlimited: false,
  },
];

// ── Plans ─────────────────────────────────────────────────────────────────────
const plans = [
  {
    id: "starter",
    name: "Starter",
    price: "$49",
    period: "/mo",
    icon: Star,
    current: false,
    features: [
      "50 scans / month",
      "1 user",
      "Scanner + Scam Detection",
      "Email support",
    ],
    cta: "Downgrade",
    ctaVariant: "outline" as const,
    glow: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$149",
    period: "/mo",
    icon: Zap,
    current: true,
    features: [
      "Unlimited scans",
      "5 users",
      "All 5 modules",
      "AI assistant",
      "Priority support",
      "API access",
    ],
    cta: "Current Plan",
    ctaVariant: "default" as const,
    glow: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "",
    icon: Building2,
    current: false,
    features: [
      "Unlimited everything",
      "50+ users",
      "SSO & SAML",
      "Audit logs",
      "Dedicated support",
      "SLA & white-labeling",
    ],
    cta: "Contact Sales",
    ctaVariant: "default" as const,
    glow: false,
  },
];

// ── Billing history ───────────────────────────────────────────────────────────
const invoices = [
  {
    date: "May 15, 2025",
    desc: "Pro Plan — Monthly",
    amount: "$149.00",
    status: "Paid",
  },
  {
    date: "Apr 15, 2025",
    desc: "Pro Plan — Monthly",
    amount: "$149.00",
    status: "Paid",
  },
  {
    date: "Mar 15, 2025",
    desc: "Pro Plan — Monthly",
    amount: "$149.00",
    status: "Paid",
  },
];

export default function BillingPage() {
  return (
    <div className="min-h-full p-6 lg:p-8" data-ocid="billing.page">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div {...fade(0)}>
          <h1 className="text-2xl font-bold text-foreground">
            Billing & Subscription
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your plan, usage, and payment history
          </p>
        </motion.div>

        {/* ── Section 1: Current Plan ── */}
        <motion.div {...fade(0.04)}>
          <Card
            className="glass border-primary/30 relative overflow-hidden"
            style={{ boxShadow: "0 0 32px rgba(6,182,212,0.12)" }}
            data-ocid="billing.current_plan_card"
          >
            {/* Subtle top glow line */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary/15 text-primary border-primary/30 text-xs">
                      Pro Plan
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-xs border-border/50 text-muted-foreground"
                    >
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground">
                      $149
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Next billing date:{" "}
                      <span className="text-foreground font-medium">
                        June 15, 2025
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Usage period:{" "}
                      <span className="text-foreground">
                        May 15 — June 15, 2025
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {[
                      "Unlimited scans",
                      "5 users",
                      "All 5 modules",
                      "AI assistant",
                      "Priority support",
                    ].map((f) => (
                      <span
                        key={f}
                        className="flex items-center gap-1 text-xs text-muted-foreground"
                      >
                        <CheckCircle2 className="w-3 h-3 text-primary" />
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:items-end">
                  <Button
                    type="button"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
                    style={{ boxShadow: "0 0 16px rgba(6,182,212,0.25)" }}
                    data-ocid="billing.upgrade_button"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    Upgrade to Enterprise
                  </Button>
                  <button
                    type="button"
                    className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                    onClick={() =>
                      toast.info("Please contact support to cancel your plan.")
                    }
                    data-ocid="billing.cancel_plan_link"
                  >
                    Cancel Plan
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Section 2: Usage Meters ── */}
        <motion.div {...fade(0.08)} data-ocid="billing.usage_section">
          <h2 className="text-base font-semibold text-foreground mb-4">
            Usage This Period
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {usageItems.map((item, i) => (
              <Card
                key={item.label}
                className="glass border-border/50"
                data-ocid={`billing.usage.item.${i + 1}`}
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-md bg-muted/60 flex items-center justify-center">
                        <item.icon className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        {item.label}
                      </p>
                    </div>
                    {item.unlimited ? (
                      <Badge className="text-[10px] bg-chart-3/15 text-emerald-400 border-chart-3/30 gap-1">
                        <InfinityIcon className="w-3 h-3" />
                        Unlimited
                      </Badge>
                    ) : (
                      <span className="text-xs font-mono text-muted-foreground">
                        {item.pct}%
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">
                    {item.display}
                  </p>
                  {!item.unlimited && item.pct !== null && (
                    <div className="space-y-1">
                      <Progress
                        value={item.pct}
                        className="h-1.5 bg-muted/40"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* ── Section 3: Plan Comparison ── */}
        <motion.div {...fade(0.12)} data-ocid="billing.plans_section">
          <h2 className="text-base font-semibold text-foreground mb-4">
            Available Plans
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + i * 0.06, duration: 0.28 }}
              >
                <Card
                  className={`glass relative overflow-hidden h-full flex flex-col ${
                    plan.current ? "border-primary/50" : "border-border/50"
                  }`}
                  style={
                    plan.glow
                      ? { boxShadow: "0 0 28px rgba(6,182,212,0.15)" }
                      : {}
                  }
                  data-ocid={`billing.plan_card.${plan.id}`}
                >
                  {plan.current && (
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
                  )}
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <plan.icon className="w-4 h-4 text-primary" />
                      </div>
                      {plan.current && (
                        <Badge className="text-[10px] bg-primary/15 text-primary border-primary/30">
                          Current
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-sm font-semibold text-foreground mt-2">
                      {plan.name}
                    </CardTitle>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-2xl font-bold text-foreground">
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-xs text-muted-foreground">
                          {plan.period}
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-1 gap-4">
                    <ul className="space-y-1.5 flex-1">
                      {plan.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-center gap-2 text-xs text-muted-foreground"
                        >
                          <CheckCircle2 className="w-3 h-3 text-primary shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    {plan.current ? (
                      <Button
                        type="button"
                        disabled
                        className="w-full bg-primary/20 text-primary border border-primary/30 cursor-not-allowed"
                        data-ocid={`billing.plan_cta.${plan.id}`}
                      >
                        {plan.cta}
                      </Button>
                    ) : plan.id === "enterprise" ? (
                      <Button
                        type="button"
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                        style={{ boxShadow: "0 0 14px rgba(6,182,212,0.2)" }}
                        onClick={() =>
                          toast.info("Our sales team will reach out shortly.")
                        }
                        data-ocid={`billing.plan_cta.${plan.id}`}
                      >
                        {plan.cta}
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full border-border/60 hover:bg-muted/40"
                        onClick={() =>
                          toast.info(
                            "Plan downgrade initiated. Check your email.",
                          )
                        }
                        data-ocid={`billing.plan_cta.${plan.id}`}
                      >
                        {plan.cta}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Section 4: Billing History ── */}
        <motion.div {...fade(0.18)} data-ocid="billing.history_section">
          <h2 className="text-base font-semibold text-foreground mb-4">
            Billing History
          </h2>
          <Card className="glass border-border/50">
            <CardContent className="p-0">
              {/* Table header */}
              <div className="grid grid-cols-12 px-4 py-3 border-b border-border/40">
                <p className="col-span-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Date
                </p>
                <p className="col-span-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Description
                </p>
                <p className="col-span-2 text-xs font-medium text-muted-foreground uppercase tracking-wider text-right">
                  Amount
                </p>
                <p className="col-span-2 text-xs font-medium text-muted-foreground uppercase tracking-wider text-center">
                  Status
                </p>
                <p className="col-span-1" />
              </div>
              {invoices.map((inv, i) => (
                <div key={inv.date + inv.desc}>
                  <div
                    className="grid grid-cols-12 items-center px-4 py-3.5 hover:bg-muted/20 transition-colors"
                    data-ocid={`billing.invoice.item.${i + 1}`}
                  >
                    <p className="col-span-3 text-sm text-muted-foreground">
                      {inv.date}
                    </p>
                    <p className="col-span-4 text-sm text-foreground">
                      {inv.desc}
                    </p>
                    <p className="col-span-2 text-sm font-mono text-foreground text-right">
                      {inv.amount}
                    </p>
                    <div className="col-span-2 flex justify-center">
                      <Badge className="text-[10px] bg-chart-3/15 text-emerald-400 border-chart-3/30">
                        {inv.status}
                      </Badge>
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <button
                        type="button"
                        className="p-1.5 rounded-md hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() =>
                          toast.success("Receipt download started")
                        }
                        aria-label="Download receipt"
                        data-ocid={`billing.download_receipt_button.${i + 1}`}
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  {i < invoices.length - 1 && (
                    <Separator className="opacity-30" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Bottom spacing */}
        <div className="h-4" />
      </div>
    </div>
  );
}
