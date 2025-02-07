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
import { insertUserSchema, type InsertUser } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Loader2, AlertCircle, ArrowLeft, Heart } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Navigation } from "@/components/navigation";

export default function AuthPage() {
  const { loginMutation, registerMutation, user } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [error, setError] = useState<string | null>(null);

  const form = useForm<InsertUser>({
    resolver: zodResolver(
      activeTab === "login"
        ? insertUserSchema.pick({ email: true, password: true })
        : insertUserSchema
    ),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
    },
  });

  if (user) {
    setLocation("/dashboard");
    return null;
  }

  const onSubmit = async (data: InsertUser) => {
    setError(null);
    try {
      if (activeTab === "login") {
        await loginMutation.mutateAsync(data);
      } else {
        await registerMutation.mutateAsync(data);
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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => setLocation("/")}
          className="mb-8 -ml-2 hover:bg-background/60 transition-colors group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
          Back
        </Button>

        <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
          <Card className="lg:col-span-3 border-primary/10 hover:border-primary/20 transition-colors duration-300">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold tracking-tight">
                {activeTab === "login" ? "Welcome back" : "Let's get started"}
              </CardTitle>
              <CardDescription>
                {activeTab === "login"
                  ? "Sign in to manage your CV reviews"
                  : "Create your account to get expert CV feedback"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
                <TabsList className="grid grid-cols-2 w-full mb-8">
                  <TabsTrigger value="login" className="text-sm">Login</TabsTrigger>
                  <TabsTrigger value="register" className="text-sm">Register</TabsTrigger>
                </TabsList>

                {error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Authentication Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {activeTab === "register" && (
                  <div className="mb-6 text-sm bg-primary/5 border border-primary/10 p-4 rounded-lg">
                    <p className="flex items-start gap-2">
                      <span className="mt-0.5">🔒</span>
                      <span>
                        Don't worry! We only need these details to create your secure portal for CV reviews.
                        <span className="block mt-1 text-muted-foreground">
                          No spam emails, no newsletters - just a safe space for your career growth journey! <span className="ml-1">✨</span>
                        </span>
                      </span>
                    </p>
                  </div>
                )}

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {activeTab === "register" && (
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <Label>What can we call you?</Label>
                            <FormControl>
                              <Input
                                placeholder="Enter your first name"
                                {...field}
                                disabled={registerMutation.isPending}
                                className="focus:ring-2 focus:ring-primary transition-shadow duration-200"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Email address</Label>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="you@example.com"
                              {...field}
                              disabled={loginMutation.isPending || registerMutation.isPending}
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
                              placeholder={activeTab === "register" ? "Create a secure password" : "Enter your password"}
                              {...field}
                              disabled={loginMutation.isPending || registerMutation.isPending}
                              className="focus:ring-2 focus:ring-primary transition-shadow duration-200"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full transition-all duration-200 hover:translate-y-[-2px]"
                      disabled={loginMutation.isPending || registerMutation.isPending}
                    >
                      {(loginMutation.isPending || registerMutation.isPending) ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {activeTab === "login" ? "Signing in..." : "Creating your account..."}
                        </>
                      ) : (
                        activeTab === "login" ? "Sign In" : "Create Account"
                      )}
                    </Button>
                  </form>
                </Form>
              </Tabs>
            </CardContent>
          </Card>

          <div className="relative lg:col-span-2">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80 rounded-3xl opacity-90" />
            <div className="relative p-6 text-primary-foreground h-full flex flex-col justify-center">
              <div className="mb-6">
                <FileText className="w-12 h-12 mb-4 animate-fade-in" />
                <h1 className="text-xl font-bold mb-2">
                  Expert CV Review Service
                </h1>
                <p className="text-primary-foreground/90 text-sm leading-relaxed">
                  Get personalized feedback on your CV from industry experts. Our professional
                  reviewers will help you stand out to employers and increase your chances of
                  landing your dream job.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <div className="text-lg font-bold mb-1">48h</div>
                  <div className="text-sm text-primary-foreground/80">Fast Turnaround</div>
                </div>
                <div>
                  <div className="text-lg font-bold mb-1">1000+</div>
                  <div className="text-sm text-primary-foreground/80">CVs Reviewed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}