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
import { FileText, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SiGoogle } from "react-icons/si";

export default function AuthPage() {
  const { loginMutation, registerMutation, user } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [error, setError] = useState<string | null>(null);

  const form = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

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
        // Convert backend error messages to user-friendly messages
        if (err.message.includes("Invalid username or password")) {
          setError("The username or password you entered is incorrect. Please try again.");
        } else if (err.message.includes("Username already exists")) {
          setError("This username is already taken. Please choose a different one.");
        } else {
          setError("Something went wrong. Please try again later.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <div className="grid lg:grid-cols-2 gap-8 w-full max-w-5xl">
        <Card className="lg:order-2">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              {activeTab === "login" ? "Welcome back" : "Create an account"}
            </CardTitle>
            <CardDescription>
              {activeTab === "login"
                ? "Enter your credentials to access your account"
                : "Fill in your details to create a new account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
              <TabsList className="grid grid-cols-2 w-full mb-8">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Authentication Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Username</Label>
                        <FormControl>
                          <Input 
                            placeholder="Enter your username"
                            {...field}
                            disabled={loginMutation.isPending || registerMutation.isPending}
                            className="focus:ring-2 focus:ring-primary"
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
                            placeholder="Enter your password"
                            {...field}
                            disabled={loginMutation.isPending || registerMutation.isPending}
                            className="focus:ring-2 focus:ring-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loginMutation.isPending || registerMutation.isPending}
                  >
                    {(loginMutation.isPending || registerMutation.isPending) ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {activeTab === "login" ? "Logging in..." : "Creating account..."}
                      </>
                    ) : (
                      activeTab === "login" ? "Login" : "Create Account"
                    )}
                  </Button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGoogleLogin}
                      className="w-full"
                    >
                      <SiGoogle className="mr-2 h-4 w-4" />
                      Continue with Google
                    </Button>
                  </div>
                </form>
              </Form>
            </Tabs>
          </CardContent>
        </Card>

        <div className="relative lg:order-1">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80 rounded-3xl opacity-90" />
          <div className="relative p-8 text-primary-foreground h-full flex flex-col justify-center">
            <div className="mb-8">
              <FileText className="w-16 h-16 mb-6" />
              <h1 className="text-3xl font-bold mb-4">
                Professional CV Review Service
              </h1>
              <p className="text-primary-foreground/90 text-lg leading-relaxed">
                Get expert feedback on your CV, access professional templates, and book
                consultations with industry experts to advance your career.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-auto">
              <div>
                <div className="text-2xl font-bold mb-2">24/7</div>
                <div className="text-primary-foreground/80">Expert Support</div>
              </div>
              <div>
                <div className="text-2xl font-bold mb-2">1000+</div>
                <div className="text-primary-foreground/80">CVs Reviewed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}