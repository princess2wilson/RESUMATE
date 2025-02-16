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
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  // For admin routes, redirect to admin login if not authenticated or not an admin
  if (adminOnly) {
    if (!user?.isAdmin) {
      return <Redirect to="/admin/login" />;
    }
  } else if (!user) { // For regular protected routes
    return <Redirect to="/auth" />;
  }

  return (
    <Route path={path}>
      <Component />
    </Route>
  );
}