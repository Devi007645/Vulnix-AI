import { useAuthStore } from "@/store/auth";
import { Link, useNavigate } from "@tanstack/react-router";
import { Check, Eye, EyeOff, Lock, Mail, Shield } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const features = [
  "AI-Powered Threat Detection",
  "Real-time Vulnerability Scanning",
  "Unified Security Intelligence",
];

const particles = [
  { id: "p1", top: "15%", left: "12%", delay: "0s", size: 6 },
  { id: "p2", top: "72%", left: "25%", delay: "1.2s", size: 4 },
  { id: "p3", top: "38%", left: "78%", delay: "0.6s", size: 5 },
  { id: "p4", top: "82%", left: "65%", delay: "2.1s", size: 3 },
  { id: "p5", top: "22%", left: "55%", delay: "1.7s", size: 4 },
];

function CyberPanel() {
  return (
    <div
      className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #0A0A0A 0%, #0D1520 100%)",
      }}
    >
      {/* Grid */}
      <div className="absolute inset-0 cyber-grid opacity-60" />

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(6,182,212,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Floating particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            background: "#06B6D4",
            boxShadow: "0 0 8px 2px rgba(6,182,212,0.7)",
            animation: "float-particle 4s ease-in-out infinite",
            animationDelay: p.delay,
            opacity: 0.8,
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-12 gap-8">
        {/* Shield icon */}
        <div
          className="w-24 h-24 rounded-2xl flex items-center justify-center glow-cyan"
          style={{
            background: "rgba(6,182,212,0.08)",
            border: "1px solid rgba(6,182,212,0.3)",
            animation: "pulse-glow 3s ease-in-out infinite",
          }}
        >
          <Shield
            className="w-12 h-12"
            style={{ color: "#06B6D4" }}
            strokeWidth={1.5}
          />
        </div>

        {/* Logo */}
        <div>
          <h1 className="text-4xl font-bold text-gradient-cyan tracking-tight">
            Vulnix AI
          </h1>
          <p
            className="mt-2 text-sm"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Enterprise-grade AI cybersecurity platform
          </p>
        </div>

        {/* Feature bullets */}
        <ul className="flex flex-col gap-3 w-full max-w-xs">
          {features.map((f) => (
            <li key={f} className="flex items-center gap-3">
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: "rgba(6,182,212,0.15)",
                  border: "1px solid rgba(6,182,212,0.4)",
                }}
              >
                <Check className="w-3 h-3" style={{ color: "#06B6D4" }} />
              </span>
              <span
                className="text-sm text-left"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                {f}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [loading, setLoading] = useState(false);

  function validate() {
    const e: typeof errors = {};
    if (!email) e.email = "Email is required";
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(email))
      e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    return e;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    login(email);
    navigate({ to: "/app/overview" });
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#0A0A0A" }}>
      <style>{`
        @keyframes float-particle {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.8; }
          50% { transform: translateY(-14px) scale(1.2); opacity: 1; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(6,182,212,0.3); }
          50% { box-shadow: 0 0 40px rgba(6,182,212,0.6); }
        }
      `}</style>

      <CyberPanel />

      {/* Right: form */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="flex-1 lg:w-1/2 flex items-center justify-center px-6 py-12"
        style={{ background: "#0A0A0A" }}
      >
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <Shield className="w-6 h-6" style={{ color: "#06B6D4" }} />
            <span className="text-xl font-bold text-gradient-cyan">
              Vulnix AI
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground tracking-tight">
              Welcome back
            </h2>
            <p
              className="mt-2 text-sm"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Sign in to your Vulnix AI account
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
            noValidate
          >
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                className="text-xs font-medium"
                htmlFor="login-email"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                Email address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{
                    color: errors.email ? "#ef4444" : "rgba(255,255,255,0.35)",
                  }}
                />
                <input
                  id="login-email"
                  data-ocid="login.email_input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none transition-smooth"
                  style={{
                    background: "#111111",
                    border: `1px solid ${errors.email ? "#ef4444" : "rgba(255,255,255,0.08)"}`,
                    boxShadow: errors.email
                      ? "0 0 0 2px rgba(239,68,68,0.15)"
                      : undefined,
                  }}
                />
              </div>
              {errors.email && (
                <p
                  data-ocid="login.email_field_error"
                  className="text-xs"
                  style={{ color: "#ef4444" }}
                >
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label
                className="text-xs font-medium"
                htmlFor="login-password"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{
                    color: errors.password
                      ? "#ef4444"
                      : "rgba(255,255,255,0.35)",
                  }}
                />
                <input
                  id="login-password"
                  data-ocid="login.password_input"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none transition-smooth"
                  style={{
                    background: "#111111",
                    border: `1px solid ${errors.password ? "#ef4444" : "rgba(255,255,255,0.08)"}`,
                  }}
                />
                <button
                  type="button"
                  data-ocid="login.password_toggle"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-smooth"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p
                  data-ocid="login.password_field_error"
                  className="text-xs"
                  style={{ color: "#ef4444" }}
                >
                  {errors.password}
                </p>
              )}
              <div className="flex justify-end">
                <Link
                  to="/login"
                  data-ocid="login.forgot_password_link"
                  className="text-xs transition-smooth"
                  style={{ color: "#06B6D4" }}
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              data-ocid="login.submit_button"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-semibold transition-smooth flex items-center justify-center gap-2"
              style={{
                background: loading
                  ? "rgba(6,182,212,0.3)"
                  : "linear-gradient(90deg, #06B6D4 0%, #3b82f6 100%)",
                color: loading ? "rgba(255,255,255,0.6)" : "#000",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <>
                  <span
                    className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin inline-block"
                    style={{
                      borderColor:
                        "rgba(255,255,255,0.4) rgba(255,255,255,0.4) rgba(255,255,255,0.4) transparent",
                    }}
                  />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div
                className="flex-1 h-px"
                style={{ background: "rgba(255,255,255,0.08)" }}
              />
              <span
                className="text-xs"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                or continue with
              </span>
              <div
                className="flex-1 h-px"
                style={{ background: "rgba(255,255,255,0.08)" }}
              />
            </div>

            {/* Social */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                data-ocid="login.github_button"
                disabled
                className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium opacity-50 cursor-not-allowed transition-smooth"
                style={{
                  background: "#111111",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  role="img"
                  aria-label="GitHub"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                GitHub
              </button>
              <button
                type="button"
                data-ocid="login.google_button"
                disabled
                className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium opacity-50 cursor-not-allowed transition-smooth"
                style={{
                  background: "#111111",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-label="Google"
                >
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>
            </div>

            <p
              className="text-sm text-center"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Don't have an account?{" "}
              <Link
                to="/register"
                data-ocid="login.register_link"
                className="font-medium transition-smooth"
                style={{ color: "#06B6D4" }}
              >
                Register
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
