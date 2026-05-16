import AIAssistant from "@/components/AIAssistant";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { useUIStore } from "@/store/ui";
import {
  Link,
  Outlet,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import {
  Bell,
  Bot,
  ChevronLeft,
  ChevronRight,
  Code2,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  MessageSquareWarning,
  Search,
  Settings,
  Shield,
  Target,
  User,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

const navItems = [
  { path: "/app/overview", label: "Overview", icon: LayoutDashboard },
  { path: "/app/scanner", label: "Vulnerability Scanner", icon: Shield },
  { path: "/app/bug-bounty", label: "Bug Bounty AI", icon: Target },
  { path: "/app/code-review", label: "Code Review", icon: Code2 },
  { path: "/app/agents", label: "AI Security Agents", icon: Bot },
  { path: "/app/learning", label: "Learning Arena", icon: GraduationCap },
  {
    path: "/app/scam-detection",
    label: "Scam Detection",
    icon: MessageSquareWarning,
  },
  { path: "/app/billing", label: "Billing", icon: CreditCard },
  { path: "/app/settings", label: "Settings", icon: Settings },
] as const;

const pageTitles: Record<string, string> = {
  "/app/overview": "Overview",
  "/app/scanner": "Vulnerability Scanner",
  "/app/bug-bounty": "Bug Bounty AI",
  "/app/code-review": "Secure Code Review",
  "/app/agents": "AI Security Agents",
  "/app/learning": "Learning Arena",
  "/app/scam-detection": "Scam Detection",
  "/app/billing": "Billing",
  "/app/settings": "Settings",
};

export function AppLayout() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const { userEmail, logout } = useAuthStore();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const pageTitle = pageTitles[currentPath] ?? "Dashboard";

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  const userInitial = userEmail ? userEmail[0].toUpperCase() : "U";

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        data-ocid="app.sidebar"
        animate={{ width: sidebarCollapsed ? 64 : 240 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className="relative flex flex-col h-full bg-card border-r shrink-0 overflow-hidden scrollbar-cyber"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        {/* Logo */}
        <div
          className="flex items-center h-16 px-4 shrink-0 border-b"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0 glow-cyan">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="font-bold text-lg text-gradient-cyan tracking-tight whitespace-nowrap overflow-hidden"
                >
                  Vulnix AI
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <button
            type="button"
            data-ocid="app.sidebar_toggle"
            onClick={toggleSidebar}
            className={cn(
              "ml-auto shrink-0 w-6 h-6 rounded-md flex items-center justify-center transition-smooth",
              "text-muted-foreground hover:text-foreground hover:bg-muted/60",
            )}
            aria-label={
              sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-3.5 h-3.5" />
            ) : (
              <ChevronLeft className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 overflow-y-auto scrollbar-cyber">
          <ul className="space-y-0.5 px-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    data-ocid={`nav.${item.label.toLowerCase().replace(/\s+/g, "_")}`}
                    className={cn(
                      "flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm transition-smooth relative group",
                      isActive
                        ? "bg-primary/10 text-primary border-l-2 border-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
                    )}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <Icon
                      className={cn(
                        "w-4 h-4 shrink-0",
                        isActive && "drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]",
                      )}
                    />
                    <AnimatePresence>
                      {!sidebarCollapsed && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="whitespace-nowrap overflow-hidden text-ellipsis"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User section */}
        <div
          className="p-3 border-t shrink-0"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <div
            className={cn(
              "flex items-center gap-2.5",
              sidebarCollapsed && "justify-center",
            )}
          >
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-xs font-semibold shrink-0">
              {userInitial}
            </div>
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 min-w-0 overflow-hidden"
                >
                  <p className="text-xs font-medium text-foreground truncate">
                    {userEmail || "user@vulnix.ai"}
                  </p>
                  <p className="text-xs text-muted-foreground">Pro Plan</p>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    data-ocid="app.logout_button"
                    onClick={handleLogout}
                    className="w-7 h-7 text-muted-foreground hover:text-destructive shrink-0"
                    aria-label="Log out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top navbar */}
        <header
          data-ocid="app.topbar"
          className="h-16 flex items-center gap-4 px-6 bg-card border-b shrink-0"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <h1 className="text-base font-semibold text-foreground min-w-0 truncate">
            {pageTitle}
          </h1>

          <div className="flex items-center gap-3 ml-auto">
            <div className="relative hidden sm:block">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                data-ocid="app.search_input"
                placeholder="Search..."
                className="pl-8 h-8 w-48 bg-muted/40 border-border/50 text-sm focus-visible:ring-primary/50"
              />
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              data-ocid="app.notifications_button"
              className="relative w-8 h-8 text-muted-foreground hover:text-foreground"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <Badge className="absolute -top-0.5 -right-0.5 w-4 h-4 p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground border-0">
                3
              </Badge>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  data-ocid="app.user_menu"
                  className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-semibold hover:bg-primary/30"
                  aria-label="User menu"
                >
                  {userInitial}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-44 bg-card border-border/50"
              >
                <DropdownMenuItem
                  data-ocid="app.profile_link"
                  onClick={() => navigate({ to: "/app/settings" })}
                  className="cursor-pointer"
                >
                  <User className="w-4 h-4 mr-2" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  data-ocid="app.settings_link"
                  onClick={() => navigate({ to: "/app/settings" })}
                  className="cursor-pointer"
                >
                  <Settings className="w-4 h-4 mr-2" /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  data-ocid="app.dropdown_logout"
                  onClick={handleLogout}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto scrollbar-cyber">
          <Outlet />
        </main>
      </div>

      {/* Global AI Assistant */}
      <AIAssistant />
    </div>
  );
}
