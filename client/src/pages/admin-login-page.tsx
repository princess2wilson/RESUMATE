import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Shield, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AdminLoginPage() {
  const { loginMutation, user } = useAuth();
  const [, setLocation] = useLocation();
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(
      insertUserSchema.pick({ email: true, password: true })
    ),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Redirect if already logged in as admin
  if (user?.isAdmin) {
    setLocation("/admin");
    return null;
  }

  // Redirect regular users to the main page
  if (user && !user.isAdmin) {
    setLocation("/");
    return null;
  }

  const onSubmit = async (data: { email: string; password: string }) => {
    setError(null);
    try {
      const user = await loginMutation.mutateAsync(data);
      if (!user.isAdmin) {
        setError("Access denied. This login is for administrators only.");
        return;
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-primary/10">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-6 h-6 text-primary" />
            <CardTitle className="text-2xl font-bold tracking-tight">
              Admin Access
            </CardTitle>
          </div>
          <CardDescription>
            Secure login portal for system administrators.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {error}
              </AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label>Email address</Label>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="admin@resumate.com"
                        {...field}
                        disabled={loginMutation.isPending}
                        className="focus:ring-2 focus:ring-primary transition-shadow duration-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <Label>Password</Label>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your admin password"
                        {...field}
                        disabled={loginMutation.isPending}
                        className="focus:ring-2 focus:ring-primary transition-shadow duration-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Authenticating..." : "Access Admin Panel"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}