import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { BookOpen, Users, LogOut, ArrowRight, FileText, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

const slideIn = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
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
            <div className="font-serif text-xl font-bold text-primary">RESUMATE</div>
            <div className="space-x-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground uppercase-spaced">
                    Welcome, {user.username}
                  </span>
                  <Button variant="outline" asChild>
                    <Link href="/dashboard">DASHBOARD</Link>
                  </Button>
                  {user.isAdmin && (
                    <Button variant="outline" asChild>
                      <Link href="/admin">ADMIN PANEL</Link>
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                    size="sm"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    LOGOUT
                  </Button>
                </div>
              ) : (
                <Button className="bg-primary hover:bg-primary/90 uppercase-spaced" asChild>
                  <Link href="/auth">GET STARTED</Link>
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
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              className="flex-1 space-y-8"
              variants={fadeIn}
            >
              <div className="space-y-6">
                <motion.p 
                  className="uppercase-spaced text-primary flex items-center justify-center gap-2"
                  variants={slideIn}
                >
                  <Sparkles className="w-5 h-5" />
                  TRANSFORM YOUR CAREER TODAY
                </motion.p>
                <motion.h1 
                  className="text-5xl lg:text-7xl font-serif font-bold tracking-tight"
                  variants={fadeIn}
                >
                  Elevate Your Professional Story with
                  <span className="gradient-text"> Resumate</span>
                </motion.h1>
                <motion.p 
                  className="text-xl text-muted-foreground max-w-[800px] mx-auto leading-relaxed"
                  variants={fadeIn}
                >
                  Get expert CV reviews, access premium career resources, and receive personalized 
                  guidance from industry professionals who understand your journey.
                </motion.p>
              </div>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                variants={fadeIn}
              >
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 uppercase-spaced" 
                  onClick={scrollToServices}
                >
                  EXPLORE SERVICES
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  asChild
                  className="w-full sm:w-auto uppercase-spaced"
                >
                  <Link href="/auth">
                    START NOW
                  </Link>
                </Button>
              </motion.div>
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
            <p className="uppercase-spaced text-primary mb-4">OUR SERVICES</p>
            <h2 className="text-4xl font-serif font-bold tracking-tight mb-4">Comprehensive Career Solutions</h2>
            <p className="text-muted-foreground max-w-[600px] mx-auto text-lg">
              Choose the service that best fits your career development needs
            </p>
          </motion.div>
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={staggerChildren}
          >
            {/* CV Review Service */}
            <motion.div 
              variants={fadeIn}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="relative overflow-hidden border hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="font-serif">CV REVIEW</CardTitle>
                  <div className="text-3xl font-bold mt-2">$49<span className="text-lg text-muted-foreground">/review</span></div>
                  <CardDescription>
                    Professional CV Review & Feedback
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-muted-foreground mb-6">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                      Detailed analysis & scoring
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                      Industry-specific advice
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                      48-hour turnaround
                    </li>
                  </ul>
                  <Button className="w-full bg-primary hover:bg-primary/90 uppercase-spaced" asChild>
                    <Link href={user ? "/dashboard" : "/auth"}>GET REVIEW</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Digital Resources */}
            <motion.div 
              variants={fadeIn}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="relative overflow-hidden border hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="font-serif">RESOURCE LIBRARY</CardTitle>
                  <CardDescription>
                    Premium Templates & Guides
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-muted-foreground mb-6">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                      CV Templates
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                      Interview Guides
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                      Career Resources
                    </li>
                  </ul>
                  <Button className="w-full bg-primary hover:bg-primary/90 uppercase-spaced" asChild>
                    <Link href={user ? "/dashboard" : "/auth"}>ACCESS LIBRARY</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Consultation */}
            <motion.div 
              variants={fadeIn}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="relative overflow-hidden border hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="font-serif">CONSULTATION</CardTitle>
                  <div className="text-3xl font-bold mt-2">$99<span className="text-lg text-muted-foreground">/hour</span></div>
                  <CardDescription>
                    One-on-One Career Guidance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-muted-foreground mb-6">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                      Career Strategy Session
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                      Interview Preparation
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                      Mentoring Available
                    </li>
                  </ul>
                  <Button className="w-full bg-primary hover:bg-primary/90 uppercase-spaced" asChild>
                    <Link href={user ? "/dashboard" : "/auth"}>BOOK NOW</Link>
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