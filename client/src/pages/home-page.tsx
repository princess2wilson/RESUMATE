import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { BookOpen, FileText, Users, LogOut } from "lucide-react";
import { motion } from "framer-motion";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function HomePage() {
  const { user, logoutMutation } = useAuth();

  const scrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b sticky top-0 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 z-50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="font-bold text-xl text-primary">CV Expert</div>
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
                <Button asChild className="bg-primary hover:bg-primary/90">
                  <Link href="/auth">Get Started</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section 
        className="relative overflow-hidden py-20 lg:py-32"
        initial="initial"
        animate="animate"
        variants={staggerChildren}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12 max-w-6xl mx-auto">
            <motion.div 
              className="flex-1 space-y-8"
              variants={fadeIn}
            >
              <div className="space-y-6">
                <motion.h1 
                  className="text-5xl lg:text-7xl font-bold tracking-tight"
                  variants={fadeIn}
                >
                  Stand Out with a
                  <span className="text-primary"> Professional CV</span>
                </motion.h1>
                <motion.p 
                  className="text-xl text-muted-foreground max-w-[600px] leading-relaxed"
                  variants={fadeIn}
                >
                  Get expert feedback, access premium templates, and book personalized consultations to advance your career journey.
                </motion.p>
              </div>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                variants={fadeIn}
              >
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90" asChild>
                  <Link href={user ? "/dashboard" : "/auth"}>
                    Get Started Today
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={scrollToServices}
                  className="w-full sm:w-auto"
                >
                  See How It Works
                </Button>
              </motion.div>
            </motion.div>
            <motion.div 
              className="flex-1 relative"
              variants={fadeIn}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl" />
              <div className="relative p-8">
                <motion.div
                  animate={{ 
                    scale: [1, 1.02, 1],
                    rotate: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <FileText className="w-32 h-32 text-primary mx-auto" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Services Section */}
      <motion.section 
        id="services" 
        className="py-24 bg-gray-50"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerChildren}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            variants={fadeIn}
          >
            <h2 className="text-4xl font-bold tracking-tight mb-4">Our Services</h2>
            <p className="text-muted-foreground max-w-[600px] mx-auto text-lg">
              Everything you need to build a winning CV
            </p>
          </motion.div>
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={staggerChildren}
          >
            {/* CV Review Card */}
            <motion.div variants={fadeIn}>
              <Card className="relative overflow-hidden border hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Expert CV Review</CardTitle>
                  <CardDescription>
                    Professional feedback from industry experts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-muted-foreground mb-6">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                      Detailed analysis and scoring
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                      Industry-specific recommendations
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                      48-hour turnaround time
                    </li>
                  </ul>
                  <Button className="w-full bg-primary hover:bg-primary/90" asChild>
                    <Link href={user ? "/dashboard" : "/auth"}>Get Review</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Digital Products Card */}
            <motion.div variants={fadeIn}>
              <Card className="relative overflow-hidden border hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Premium Templates</CardTitle>
                  <CardDescription>
                    Professional templates and guides
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-muted-foreground mb-6">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                      ATS-optimized templates
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                      Industry-specific formats
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                      Easy-to-use guides
                    </li>
                  </ul>
                  <Button className="w-full bg-primary hover:bg-primary/90" asChild>
                    <Link href={user ? "/dashboard" : "/auth"}>Get Templates</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Consultation Card */}
            <motion.div variants={fadeIn}>
              <Card className="relative overflow-hidden border hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Career Consultation</CardTitle>
                  <CardDescription>
                    One-on-one expert guidance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-muted-foreground mb-6">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                      30-minute strategy session
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                      Career path planning
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                      Interview preparation
                    </li>
                  </ul>
                  <Button className="w-full bg-primary hover:bg-primary/90" asChild>
                    <Link href={user ? "/dashboard" : "/auth"}>Book Session</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}