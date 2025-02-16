import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

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

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      </Route>
    );
  }

  // For admin routes, redirect to admin login if not authenticated or not an admin
  if (adminOnly) {
    if (!user || !user.isAdmin) {
      return (
        <Route path={path}>
          <Redirect to="/admin/login" />
        </Route>
      );
    }
  } else {
    // For regular protected routes, redirect to auth if not authenticated
    if (!user) {
      return (
        <Route path={path}>
          <Redirect to="/auth" />
        </Route>
      );
    }
  }

  return <Route path={path} component={Component} />;
}