import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { Outlet, createRootRoute, createRoute } from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { LoginLayout } from "./components/Layout";
import { LoadingScreen } from "./components/LoadingBar";
import { OutlinedButton } from "./components/OutlinedButton";
import HomePage from "./pages/HomePage";

const CasesPage = lazy(() => import("./pages/CasesPage"));
const CaseDetailPage = lazy(() => import("./pages/CaseDetailPage"));
const TheoryMatchPage = lazy(() => import("./pages/TheoryMatchPage"));
const QuizPage = lazy(() => import("./pages/QuizPage"));
const JournalPage = lazy(() => import("./pages/JournalPage"));
const JournalDetailPage = lazy(() => import("./pages/JournalDetailPage"));

function AuthGate({ children }: { children: React.ReactNode }) {
  const { loginStatus, identity, login } = useInternetIdentity();

  if (loginStatus === "initializing") {
    return <LoadingScreen />;
  }

  if (!identity) {
    return (
      <LoginLayout>
        <div className="flex flex-col items-center gap-10 fade-in px-6 text-center">
          <div>
            <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-muted-foreground mb-4">
              Criminal Psychology — Study Companion
            </p>
            <h1 className="font-display italic text-5xl md:text-7xl tracking-tight text-foreground leading-none mb-2">
              VILLAIN ARC
            </h1>
          </div>
          <div className="h-px bg-border w-32" />
          <p className="font-body text-sm text-muted-foreground max-w-xs leading-relaxed">
            Authenticate to access your case files, theory engine, and study
            archive.
          </p>
          <OutlinedButton size="lg" onClick={login} data-ocid="login-btn">
            Enter with Internet Identity
          </OutlinedButton>
          <p className="font-mono text-[10px] tracking-wider text-muted-foreground">
            Fully on-chain — no external cloud
          </p>
        </div>
      </LoginLayout>
    );
  }

  return <>{children}</>;
}

const rootRoute = createRootRoute({
  component: () => (
    <AuthGate>
      <Suspense fallback={<LoadingScreen />}>
        <Outlet />
      </Suspense>
    </AuthGate>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const casesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cases",
  component: CasesPage,
});

const caseDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cases/$id",
  component: CaseDetailPage,
});

const theoryMatchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/theory-match",
  component: TheoryMatchPage,
});

const quizRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/quiz",
  component: QuizPage,
});

const journalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/journal",
  component: JournalPage,
});

const journalDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/journal/$id",
  component: JournalDetailPage,
});

const journalNewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/journal/new",
  component: JournalDetailPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  casesRoute,
  caseDetailRoute,
  theoryMatchRoute,
  quizRoute,
  journalRoute,
  journalNewRoute,
  journalDetailRoute,
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
