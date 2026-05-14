import { useAuthStore } from "@/store/auth";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Check,
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const features = [
  "AI-Powered Threat Detection",
  "Real-time Vulnerability Scanning",
  "Unified Security Intelligence",
];

const particles = [
  { top: "15%", left: "12%", delay: "0s", size: 6 },
  { top: "72%", left: "25%", delay: "1.2s", size: 4 },
  { top: "38%", left: "78%", delay: "0.6s", size: 5 },
  { top: "82%", left: "65%", delay: "2.1s", size: 3 },
  { top: "22%", left: "55%", delay: "1.7s", size: 4 },
];

function getPasswordStrength(pw: string): number {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
const strengthColors = [
  "transparent",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
];

function CyberPanel() {
  return (
    <div
      className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #0A0A0A 0%, #0D1520 100%)",
      }}
    >
      <div className="absolute inset-0 cyber-grid opacity-60" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(6,182,212,0.08) 0%, transparent 70%)",
        }}
      />
      {particles.map((p, i) => (
        <span
          key={`${p.top}-${p.left}` || i}
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
      <div className="relative z-10 flex flex-col items-center text-center px-12 gap-8">
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

type FormErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
  terms?: string;
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const strength = getPasswordStrength(password);

  function validate(): FormErrors {
    const e: FormErrors = {};
    if (!name.trim()) e.name = "Full name is required";
    if (!email) e.email = "Work email is required";
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(email))
      e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 6)
      e.password = "Password must be at least 6 characters";
    if (!confirm) e.confirm = "Please confirm your password";
    else if (confirm !== password) e.confirm = "Passwords do not match";
    if (!terms) e.terms = "You must accept the terms";
    return e;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    login(email);
    navigate({ to: "/app/overview" });
  }

  const inputBase =
    "w-full py-2.5 rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none transition-smooth";

  function inputStyle(hasError?: string) {
    return {
      background: "#111111",
      border: `1px solid ${hasError ? "#ef4444" : "rgba(255,255,255,0.08)"}`,
    };
  }

  function focusHandler(
    e: React.FocusEvent<HTMLInputElement>,
    hasError?: string,
  ) {
    e.currentTarget.style.border = `1px solid ${hasError ? "#ef4444" : "#06B6D4"}`;
  }

  function blurHandler(
    e: React.FocusEvent<HTMLInputElement>,
    hasError?: string,
  ) {
    e.currentTarget.style.border = `1px solid ${hasError ? "#ef4444" : "rgba(255,255,255,0.08)"}`;
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

          <div className="mb-6">
            <h2 className="text-3xl font-bold text-foreground tracking-tight">
              Create your account
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                Start your free 14-day trial
              </p>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  background: "rgba(6,182,212,0.12)",
                  color: "#06B6D4",
                  border: "1px solid rgba(6,182,212,0.3)",
                }}
              >
                No credit card
              </span>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            noValidate
          >
            {/* Full name */}
            <div className="flex flex-col gap-1.5">
              <label
                className="text-xs font-medium"
                htmlFor="reg-name"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                Full name
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{
                    color: errors.name ? "#ef4444" : "rgba(255,255,255,0.35)",
                  }}
                />
                <input
                  id="reg-name"
                  data-ocid="register.name_input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Smith"
                  className={`${inputBase} pl-10 pr-4`}
                  style={inputStyle(errors.name)}
                  onFocus={(e) => focusHandler(e, errors.name)}
                  onBlur={(e) => blurHandler(e, errors.name)}
                />
              </div>
              {errors.name && (
                <p
                  data-ocid="register.name_field_error"
                  className="text-xs"
                  style={{ color: "#ef4444" }}
                >
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                className="text-xs font-medium"
                htmlFor="reg-email"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                Work email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{
                    color: errors.email ? "#ef4444" : "rgba(255,255,255,0.35)",
                  }}
                />
                <input
                  id="reg-email"
                  data-ocid="register.email_input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className={`${inputBase} pl-10 pr-4`}
                  style={inputStyle(errors.email)}
                  onFocus={(e) => focusHandler(e, errors.email)}
                  onBlur={(e) => blurHandler(e, errors.email)}
                />
              </div>
              {errors.email && (
                <p
                  data-ocid="register.email_field_error"
                  className="text-xs"
                  style={{ color: "#ef4444" }}
                >
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password + strength */}
            <div className="flex flex-col gap-1.5">
              <label
                className="text-xs font-medium"
                htmlFor="reg-password"
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
                  id="reg-password"
                  data-ocid="register.password_input"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className={`${inputBase} pl-10 pr-10`}
                  style={inputStyle(errors.password)}
                  onFocus={(e) => focusHandler(e, errors.password)}
                  onBlur={(e) => blurHandler(e, errors.password)}
                />
                <button
                  type="button"
                  data-ocid="register.password_toggle"
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
              {/* Strength bar */}
              {password.length > 0 && (
                <div className="flex gap-1 items-center mt-0.5">
                  {[1, 2, 3, 4].map((seg) => (
                    <div
                      key={seg}
                      className="h-1 flex-1 rounded-full transition-all duration-300"
                      style={{
                        background:
                          seg <= strength
                            ? strengthColors[strength]
                            : "rgba(255,255,255,0.08)",
                      }}
                    />
                  ))}
                  <span
                    className="text-xs ml-1"
                    style={{
                      color:
                        strengthColors[strength] || "rgba(255,255,255,0.35)",
                      minWidth: "40px",
                    }}
                  >
                    {strengthLabels[strength]}
                  </span>
                </div>
              )}
              {errors.password && (
                <p
                  data-ocid="register.password_field_error"
                  className="text-xs"
                  style={{ color: "#ef4444" }}
                >
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm password */}
            <div className="flex flex-col gap-1.5">
              <label
                className="text-xs font-medium"
                htmlFor="reg-confirm"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                Confirm password
              </label>
              <div className="relative">
                <CheckCircle
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{
                    color: errors.confirm
                      ? "#ef4444"
                      : "rgba(255,255,255,0.35)",
                  }}
                />
                <input
                  id="reg-confirm"
                  data-ocid="register.confirm_password_input"
                  type={showConfirm ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter your password"
                  className={`${inputBase} pl-10 pr-10`}
                  style={inputStyle(errors.confirm)}
                  onFocus={(e) => focusHandler(e, errors.confirm)}
                  onBlur={(e) => blurHandler(e, errors.confirm)}
                />
                <button
                  type="button"
                  data-ocid="register.confirm_toggle"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-smooth"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.confirm && (
                <p
                  data-ocid="register.confirm_field_error"
                  className="text-xs"
                  style={{ color: "#ef4444" }}
                >
                  {errors.confirm}
                </p>
              )}
            </div>

            {/* Terms */}
            <div className="flex flex-col gap-1">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <span className="relative flex-shrink-0 mt-0.5">
                  <input
                    data-ocid="register.terms_checkbox"
                    type="checkbox"
                    checked={terms}
                    onChange={(e) => setTerms(e.target.checked)}
                    className="sr-only"
                  />
                  <span
                    className="w-4 h-4 rounded flex items-center justify-center transition-smooth"
                    style={{
                      background: terms ? "#06B6D4" : "transparent",
                      border: `1px solid ${errors.terms ? "#ef4444" : terms ? "#06B6D4" : "rgba(255,255,255,0.2)"}`,
                    }}
                  >
                    {terms && (
                      <Check
                        className="w-2.5 h-2.5"
                        style={{ color: "#000" }}
                      />
                    )}
                  </span>
                </span>
                <span
                  className="text-xs leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  I agree to the{" "}
                  <a
                    href="/terms"
                    className="underline"
                    style={{ color: "#06B6D4" }}
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy"
                    className="underline"
                    style={{ color: "#06B6D4" }}
                  >
                    Privacy Policy
                  </a>
                </span>
              </label>
              {errors.terms && (
                <p
                  data-ocid="register.terms_field_error"
                  className="text-xs"
                  style={{ color: "#ef4444" }}
                >
                  {errors.terms}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              data-ocid="register.submit_button"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-semibold transition-smooth flex items-center justify-center gap-2 mt-1"
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
                    className="w-4 h-4 rounded-full border-2 animate-spin inline-block"
                    style={{
                      borderColor:
                        "rgba(255,255,255,0.4) rgba(255,255,255,0.4) rgba(255,255,255,0.4) transparent",
                    }}
                  />
                  Creating account…
                </>
              ) : (
                "Create Account"
              )}
            </button>

            <p
              className="text-sm text-center"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Already have an account?{" "}
              <Link
                to="/login"
                data-ocid="register.signin_link"
                className="font-medium transition-smooth"
                style={{ color: "#06B6D4" }}
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
