import { AppLayout } from "@/components/layout/AppLayout";
import { PublicLayout } from "@/components/layout/PublicLayout";
import BillingPageComponent from "@/pages/BillingPage";
import BugBountyPage from "@/pages/BugBountyPage";
import CodeReviewPage from "@/pages/CodeReviewPage";
import AgentPage from "@/pages/AgentPage";
import LandingPage from "@/pages/LandingPage";
import LearningPage from "@/pages/LearningPage";
import LoginPageComponent from "@/pages/LoginPage";
import OverviewPage from "@/pages/OverviewPage";
import RegisterPageComponent from "@/pages/RegisterPage";
import ScamDetectionPage from "@/pages/ScamDetectionPage";
import ScannerPage from "@/pages/ScannerPage";
import SettingsPageComponent from "@/pages/SettingsPage";
import { useAuthStore } from "@/store/auth";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";

// ── Placeholder page components ─────────────────────────────────────────────
// imported above
const LoginPage = LoginPageComponent;
const RegisterPage = RegisterPageComponent;

// CodeReviewPage imported above
// LearningPage imported from @/pages/LearningPage
// replaced by import above
const BillingPage = BillingPageComponent;
const SettingsPage = SettingsPageComponent;

// ── Route tree ───────────────────────────────────────────────────────────────
const rootRoute = createRootRoute({
  component: Outlet,
});

// Public layout wrapper route
const publicLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "public-layout",
  component: () => (
    <PublicLayout>
      <Outlet />
    </PublicLayout>
  ),
});

const landingRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/",
  component: LandingPage,
});

const loginRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/login",
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/register",
  component: RegisterPage,
});

// Protected app layout route
const appLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "app-layout",
  beforeLoad: () => {
    const { isLoggedIn } = useAuthStore.getState();
    if (!isLoggedIn) {
      throw redirect({ to: "/login" });
    }
  },
  component: AppLayout,
});

const appIndexRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/app",
  beforeLoad: () => {
    throw redirect({ to: "/app/overview" });
  },
  component: () => null,
});

const overviewRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/app/overview",
  component: OverviewPage,
});

const scannerRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/app/scanner",
  component: ScannerPage,
});

const bugBountyRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/app/bug-bounty",
  component: BugBountyPage,
});

const codeReviewRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/app/code-review",
  component: CodeReviewPage,
});

const agentsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/app/agents",
  component: AgentPage,
});

const learningRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/app/learning",
  component: LearningPage,
});

const scamDetectionRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/app/scam-detection",
  component: ScamDetectionPage,
});

const billingRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/app/billing",
  component: BillingPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/app/settings",
  component: SettingsPage,
});

const routeTree = rootRoute.addChildren([
  publicLayoutRoute.addChildren([landingRoute, loginRoute, registerRoute]),
  appLayoutRoute.addChildren([
    appIndexRoute,
    overviewRoute,
    scannerRoute,
    bugBountyRoute,
    codeReviewRoute,
    agentsRoute,
    learningRoute,
    scamDetectionRoute,
    billingRoute,
    settingsRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
