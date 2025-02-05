import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { SiTarget } from "react-icons/si";
import { BookOpen, FileText, Users, LogOut } from "lucide-react";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();

  const scrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="font-semibold text-xl">CV Expert</div>
            <div className="space-x-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    Welcome, {user.username}
                  </span>
                  <Button variant="outline" asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                  {user.isAdmin && (
                    <Button variant="outline" asChild>
                      <Link href="/admin">Admin Panel</Link>
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                    size="sm"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button asChild>
                  <Link href="/auth">Get Started</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-24 lg:py-32">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-6xl font-bold tracking-tighter">
                  Get Expert Feedback on Your CV
                </h1>
                <p className="text-xl text-muted-foreground max-w-[600px]">
                  Professional CV review service, premium templates, and career consultations to help you land your dream job.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="w-full sm:w-auto" asChild>
                  <Link href={user ? "/dashboard" : "/auth"}>
                    Get Started
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={scrollToServices}
                  className="w-full sm:w-auto"
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl" />
              <div className="relative p-8">
                <FileText className="w-24 h-24 text-primary mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tighter mb-4">Our Services</h2>
            <p className="text-muted-foreground max-w-[600px] mx-auto">
              Comprehensive career support services to help you succeed
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* CV Review Card */}
            <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>CV Review Service</CardTitle>
                <CardDescription>
                  Get detailed feedback from industry experts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                    Detailed analysis of your CV
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                    Professional recommendations
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                    Quick turnaround time
                  </li>
                </ul>
                <Button className="w-full" asChild>
                  <Link href={user ? "/dashboard" : "/auth"}>Submit Your CV</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Digital Products Card */}
            <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Digital Resources</CardTitle>
                <CardDescription>
                  Professional templates and guides
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                    CV Templates
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                    Cover Letter Guides
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                    Career Resources
                  </li>
                </ul>
                <Button className="w-full" asChild>
                  <Link href={user ? "/dashboard" : "/auth"}>View Resources</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Consultation Card */}
            <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Free Consultation</CardTitle>
                <CardDescription>
                  Book a session with our experts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                    30-minute free session
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                    Career guidance
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                    Personalized advice
                  </li>
                </ul>
                <Button className="w-full" asChild>
                  <Link href={user ? "/dashboard" : "/auth"}>Book Now</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}