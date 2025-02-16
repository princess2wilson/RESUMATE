import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Route, useLocation } from "wouter";

export function ProtectedRoute({
  path,
  component: Component,
  adminOnly = false,
}: {
  path: string;
  component: () => React.JSX.Element;
  adminOnly?: boolean;
}) {
  const { user, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  console.log("ProtectedRoute:", { path, adminOnly, user, location }); // Debug logging

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  // For admin routes, redirect to admin login if not authenticated or not an admin
  if (adminOnly) {
    if (!user?.isAdmin) {
      console.log("Redirecting to admin login:", { user }); // Debug logging
      setLocation("/admin/login");
      return null;
    }
  } else if (!user) { // For regular protected routes
    setLocation("/auth");
    return null;
  }

  return (
    <Route path={path}>
      <Component />
    </Route>
  );
}