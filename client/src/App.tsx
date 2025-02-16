import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import HomePage from "@/pages/home-page";
import DashboardPage from "@/pages/dashboard-page";
import AdminPage from "@/pages/admin-page";
import AdminLoginPage from "./pages/admin-login-page";
import ResourceLibraryPage from "@/pages/resource-library-page";
import ConsultationPage from "@/pages/consultation-page";
import CVSubmissionPage from "@/pages/cv-submission-page";
import { ProtectedRoute } from "./lib/protected-route";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Switch>
          {/* Admin routes first to ensure they take precedence */}
          <Route path="/admin/login" component={AdminLoginPage} />
          <ProtectedRoute path="/admin" component={AdminPage} adminOnly />

          {/* Regular application routes */}
          <Route path="/" component={HomePage} />
          <Route path="/auth" component={AuthPage} />
          <ProtectedRoute path="/dashboard" component={DashboardPage} />
          <Route path="/resources" component={ResourceLibraryPage} />
          <Route path="/consultations" component={ConsultationPage} />
          <ProtectedRoute path="/cv-submission" component={CVSubmissionPage} />

          {/* 404 route */}
          <Route component={NotFound} />
        </Switch>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;