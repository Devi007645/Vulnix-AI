import { createActor } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/store/auth";
import { useActor } from "@/hooks/useActor";
import {
  Bell,
  Bot,
  Camera,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  Key,
  Plus,
  QrCode,
  Shield,
  Trash2,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const fadeIn = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: {
    duration: 0.22,
    ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
  },
};

// ── Profile Tab ──────────────────────────────────────────────────────────────
function ProfileTab() {
  const [form, setForm] = useState({
    fullName: "Alex Hunter",
    username: "alexhunter",
    email: "alex@nexacorp.com",
    role: "Security Engineer",
    company: "NexaCorp",
  });

  const handleSave = () => {
    toast.success("Profile updated successfully");
  };

  return (
    <motion.div {...fadeIn} className="space-y-6">
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="text-base text-foreground">
            Profile Photo
          </CardTitle>
          <CardDescription>
            Your avatar is visible to team members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-primary-foreground bg-primary"
                style={{ boxShadow: "0 0 20px rgba(6,182,212,0.3)" }}
              >
                AX
              </div>
              <button
                type="button"
                className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                aria-label="Change avatar"
                data-ocid="profile.avatar_edit_button"
              >
                <Camera className="w-5 h-5 text-white" />
              </button>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Alex Hunter</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                alex@nexacorp.com
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 text-xs"
                type="button"
              >
                Upload new photo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="text-base text-foreground">
            Personal Information
          </CardTitle>
          <CardDescription>Update your profile details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                htmlFor="fullName"
              >
                Full Name
              </label>
              <Input
                id="fullName"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="bg-muted/40 border-border/60 focus:border-primary/60"
                data-ocid="profile.fullname_input"
              />
            </div>
            <div className="space-y-1.5">
              <label
                className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                htmlFor="username"
              >
                Username
              </label>
              <Input
                id="username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="bg-muted/40 border-border/60 focus:border-primary/60"
                data-ocid="profile.username_input"
              />
            </div>
            <div className="space-y-1.5">
              <label
                className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                htmlFor="email"
              >
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="bg-muted/40 border-border/60 focus:border-primary/60"
                data-ocid="profile.email_input"
              />
            </div>
            <div className="space-y-1.5">
              <label
                className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                htmlFor="role"
              >
                Role
              </label>
              <Input
                id="role"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="bg-muted/40 border-border/60 focus:border-primary/60"
                data-ocid="profile.role_input"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label
                className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                htmlFor="company"
              >
                Company
              </label>
              <Input
                id="company"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="bg-muted/40 border-border/60 focus:border-primary/60"
                data-ocid="profile.company_input"
              />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button
              type="button"
              onClick={handleSave}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              style={{ boxShadow: "0 0 16px rgba(6,182,212,0.25)" }}
              data-ocid="profile.save_button"
            >
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ── Security Tab ─────────────────────────────────────────────────────────────
const sessions = [
  { browser: "Chrome", os: "macOS", when: "Current", current: true },
  { browser: "Firefox", os: "Windows", when: "2 days ago", current: false },
  { browser: "Mobile", os: "iOS", when: "1 week ago", current: false },
];

function SecurityTab() {
  const [twoFAEnabled, setTwoFAEnabled] = useState(true);
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  const handlePasswordChange = () => {
    if (!passwords.current || !passwords.next || !passwords.confirm) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (passwords.next !== passwords.confirm) {
      toast.error("New passwords do not match");
      return;
    }
    toast.success("Password updated successfully");
    setPasswords({ current: "", next: "", confirm: "" });
  };

  const handleRevoke = (browser: string) => {
    toast.success(`Session revoked: ${browser}`);
  };

  return (
    <motion.div {...fadeIn} className="space-y-6">
      {/* Change Password */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="text-base text-foreground">
            Change Password
          </CardTitle>
          <CardDescription>Use a strong, unique password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <label
              className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
              htmlFor="current-password"
            >
              Current Password
            </label>
            <Input
              id="current-password"
              type="password"
              value={passwords.current}
              onChange={(e) =>
                setPasswords({ ...passwords, current: e.target.value })
              }
              className="bg-muted/40 border-border/60 focus:border-primary/60"
              data-ocid="security.current_password_input"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                htmlFor="new-password"
              >
                New Password
              </label>
              <Input
                id="new-password"
                type="password"
                value={passwords.next}
                onChange={(e) =>
                  setPasswords({ ...passwords, next: e.target.value })
                }
                className="bg-muted/40 border-border/60 focus:border-primary/60"
                data-ocid="security.new_password_input"
              />
            </div>
            <div className="space-y-1.5">
              <label
                className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                htmlFor="confirm-password"
              >
                Confirm Password
              </label>
              <Input
                id="confirm-password"
                type="password"
                value={passwords.confirm}
                onChange={(e) =>
                  setPasswords({ ...passwords, confirm: e.target.value })
                }
                className="bg-muted/40 border-border/60 focus:border-primary/60"
                data-ocid="security.confirm_password_input"
              />
            </div>
          </div>
          <div className="flex justify-end pt-1">
            <Button
              type="button"
              onClick={handlePasswordChange}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-ocid="security.change_password_button"
            >
              Update Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 2FA */}
      <Card className="glass border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base text-foreground">
              Two-Factor Authentication
            </CardTitle>
            <CardDescription>Add an extra layer of security</CardDescription>
          </div>
          <Switch
            checked={twoFAEnabled}
            onCheckedChange={setTwoFAEnabled}
            data-ocid="security.twofa_toggle"
          />
        </CardHeader>
        <CardContent>
          {twoFAEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-4"
            >
              <div className="flex items-start gap-6">
                <div
                  className="w-32 h-32 rounded-xl bg-muted/60 border border-border/60 flex items-center justify-center shrink-0"
                  data-ocid="security.qr_code"
                >
                  <div className="text-center">
                    <QrCode className="w-8 h-8 text-muted-foreground mx-auto mb-1" />
                    <p className="text-[10px] text-muted-foreground">
                      Demo QR Code
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-foreground">
                    Scan with your authenticator app
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Use Google Authenticator, Authy, or any TOTP app to scan the
                    QR code and set up 2FA.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    data-ocid="security.backup_codes_button"
                  >
                    <Key className="w-3.5 h-3.5 mr-1.5" />
                    View Backup Codes
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
          {!twoFAEnabled && (
            <p className="text-sm text-muted-foreground">
              Enable 2FA to secure your account with a second verification step.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Sessions */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="text-base text-foreground">
            Active Sessions
          </CardTitle>
          <CardDescription>
            Manage devices logged into your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sessions.map((s, i) => (
              <div
                key={s.browser || i}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/40"
                data-ocid={`security.session.item.${i + 1}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-muted/60 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {s.browser} · {s.os}
                    </p>
                    <p className="text-xs text-muted-foreground">{s.when}</p>
                  </div>
                </div>
                {s.current ? (
                  <Badge className="text-[10px] bg-primary/15 text-primary border-primary/30">
                    Current
                  </Badge>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    className="text-xs text-destructive border-destructive/40 hover:bg-destructive/10"
                    onClick={() => handleRevoke(s.browser)}
                    data-ocid={`security.revoke_session_button.${i + 1}`}
                  >
                    Revoke
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ── Notifications Tab ─────────────────────────────────────────────────────────
const notifItems = [
  {
    id: "critical",
    label: "Email Alerts for Critical Vulnerabilities",
    desc: "Get notified immediately when critical threats are detected",
    defaultOn: true,
  },
  {
    id: "weekly",
    label: "Weekly Security Report",
    desc: "Receive a weekly summary of your security posture",
    defaultOn: true,
  },
  {
    id: "scan",
    label: "Scan Completion Notifications",
    desc: "Alert when vulnerability or code scans complete",
    defaultOn: true,
  },
  {
    id: "team",
    label: "Team Activity Updates",
    desc: "Updates on your team's actions and collaborations",
    defaultOn: false,
  },
  {
    id: "streak",
    label: "Learning Arena Streak Reminders",
    desc: "Daily reminders to keep your learning streak alive",
    defaultOn: true,
  },
  {
    id: "billing",
    label: "Billing & Subscription Alerts",
    desc: "Invoices, payment failures, and plan changes",
    defaultOn: true,
  },
  {
    id: "features",
    label: "New Feature Announcements",
    desc: "Be the first to know about new platform features",
    defaultOn: false,
  },
];

function NotificationsTab() {
  const [states, setStates] = useState<Record<string, boolean>>(
    Object.fromEntries(notifItems.map((n) => [n.id, n.defaultOn])),
  );

  return (
    <motion.div {...fadeIn}>
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="text-base text-foreground">
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Control how and when you receive alerts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1">
          {notifItems.map((item, i) => (
            <div key={item.id}>
              <div className="flex items-center justify-between py-3.5">
                <div className="flex-1 pr-8">
                  <p className="text-sm font-medium text-foreground">
                    {item.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.desc}
                  </p>
                </div>
                <Switch
                  checked={states[item.id]}
                  onCheckedChange={(val) =>
                    setStates({ ...states, [item.id]: val })
                  }
                  data-ocid={`notifications.${item.id}_toggle`}
                />
              </div>
              {i < notifItems.length - 1 && (
                <Separator className="opacity-40" />
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ── API Keys Tab ─────────────────────────────────────────────────────────────
const platformKeys = [
  {
    name: "Production Key",
    prefix: "vx_live_abc",
    suffix: "xyz",
    created: "Jan 12, 2025",
    lastUsed: "Today",
  },
  {
    name: "CI/CD Pipeline",
    prefix: "vx_live_def",
    suffix: "pqr",
    created: "Mar 3, 2025",
    lastUsed: "2 days ago",
  },
];

function ApiKeysTab() {
  const { geminiKey, setGeminiKey } = useAuthStore();
  const { actor } = useActor(createActor);
  const [keyInput, setKeyInput] = useState("");
  const [showKey, setShowKey] = useState(false);

  const handleSaveKey = async () => {
    const trimmed = keyInput.trim();
    if (!trimmed) {
      toast.error("Please enter a valid API key");
      return;
    }
    setGeminiKey(trimmed);
    if (actor) {
      try {
        await (actor as any).setGeminiKey(trimmed);
      } catch {
        // Best-effort backend persist
      }
    }
    toast.success("Gemini API key saved successfully");
    setKeyInput("");
  };

  const handleRevokePlatformKey = (name: string) => {
    toast.success(`${name} revoked`);
  };

  const handleCopyKey = (prefix: string, suffix: string) => {
    navigator.clipboard.writeText(`${prefix}...${suffix}`);
    toast.success("Key prefix copied");
  };

  const maskedKey = geminiKey ? `${geminiKey.slice(0, 4)}...${geminiKey.slice(-4)}` : "";

  return (
    <motion.div {...fadeIn} className="space-y-6">
      {/* Gemini Key */}
      <Card className="glass border-border/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base text-foreground">
                Gemini API Key
              </CardTitle>
              <CardDescription>Powers the Vulnix AI assistant</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Your API key is used to power the Vulnix AI assistant. It's stored
            securely and never shared. Enter your key to activate AI features.
          </p>
          {geminiKey && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/25">
              <Key className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-mono text-primary">
                {maskedKey}
              </span>
              <Badge className="ml-auto text-[10px] bg-primary/20 text-primary border-primary/30">
                Active
              </Badge>
            </div>
          )}
          <div className="relative">
            <Input
              type={showKey ? "text" : "password"}
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="AIza..."
              className="bg-muted/40 border-border/60 focus:border-primary/60 pr-10 font-mono text-sm"
              data-ocid="apikeys.openai_key_input"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showKey ? "Hide key" : "Show key"}
              data-ocid="apikeys.toggle_key_visibility"
            >
              {showKey ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline flex items-center gap-1"
              data-ocid="apikeys.openai_link"
            >
              Get your API key from Google AI Studio
              <ExternalLink className="w-3 h-3" />
            </a>
            <Button
              type="button"
              onClick={handleSaveKey}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              style={{ boxShadow: "0 0 16px rgba(6,182,212,0.25)" }}
              data-ocid="apikeys.save_openai_key_button"
            >
              Save API Key
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Platform API Keys */}
      <Card className="glass border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base text-foreground">
                Platform API Keys
              </CardTitle>
              <CardDescription>
                Authenticate third-party integrations with Vulnix
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              type="button"
              className="gap-1.5 border-primary/40 text-primary hover:bg-primary/10"
              data-ocid="apikeys.generate_key_button"
            >
              <Plus className="w-3.5 h-3.5" />
              Generate New Key
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {platformKeys.map((k, i) => (
              <div
                key={k.name || i}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/40"
                data-ocid={`apikeys.platform_key.item.${i + 1}`}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {k.name}
                  </p>
                  <p className="text-xs font-mono text-muted-foreground mt-0.5">
                    {k.prefix}...{k.suffix}
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-6 text-xs text-muted-foreground mx-4">
                  <span>Created {k.created}</span>
                  <span>Last used {k.lastUsed}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyKey(k.prefix, k.suffix)}
                    className="p-1.5 rounded-md hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Copy key"
                    data-ocid={`apikeys.copy_key_button.${i + 1}`}
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRevokePlatformKey(k.name)}
                    className="p-1.5 rounded-md hover:bg-destructive/15 text-muted-foreground hover:text-destructive transition-colors"
                    aria-label="Revoke key"
                    data-ocid={`apikeys.revoke_key_button.${i + 1}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ── Settings Page ─────────────────────────────────────────────────────────────
export default function SettingsPage() {
  return (
    <div className="min-h-full p-6 lg:p-8" data-ocid="settings.page">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your account preferences and security
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile" data-ocid="settings.tabs">
          <TabsList className="grid grid-cols-4 w-full bg-muted/40 border border-border/40 mb-6">
            <TabsTrigger
              value="profile"
              className="gap-1.5"
              data-ocid="settings.profile_tab"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="gap-1.5"
              data-ocid="settings.security_tab"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="gap-1.5"
              data-ocid="settings.notifications_tab"
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger
              value="api-keys"
              className="gap-1.5"
              data-ocid="settings.apikeys_tab"
            >
              <Key className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">API Keys</span>
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="profile" key="profile">
              <ProfileTab />
            </TabsContent>
            <TabsContent value="security" key="security">
              <SecurityTab />
            </TabsContent>
            <TabsContent value="notifications" key="notifications">
              <NotificationsTab />
            </TabsContent>
            <TabsContent value="api-keys" key="api-keys">
              <ApiKeysTab />
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  );
}
