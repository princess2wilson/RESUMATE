import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { BookOpen, Users, LogOut, ArrowRight, Sparkles } from "lucide-react";
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
                  YOUR CAREER TRANSFORMATION STARTS HERE
                </motion.p>
                <motion.h1 
                  className="text-5xl lg:text-7xl font-serif font-bold tracking-tight"
                  variants={fadeIn}
                >
                  Craft Your Perfect Story with
                  <span className="gradient-text"> Resumate</span>
                </motion.h1>
                <motion.p 
                  className="text-xl text-muted-foreground max-w-[800px] mx-auto leading-relaxed"
                  variants={fadeIn}
                >
                  Join thousands of professionals who've transformed their careers through our 
                  expert-guided resume building platform. Get personalized feedback, access 
                  premium templates, and connect with industry experts who understand your journey.
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
                  EXPLORE PLANS
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  asChild
                  className="w-full sm:w-auto uppercase-spaced"
                >
                  <Link href="/auth">
                    START FREE TRIAL
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
            <p className="uppercase-spaced text-primary mb-4">PRICING PLANS</p>
            <h2 className="text-4xl font-serif font-bold tracking-tight mb-4">Choose Your Success Path</h2>
            <p className="text-muted-foreground max-w-[600px] mx-auto text-lg">
              Select a plan that fits your career goals and budget
            </p>
          </motion.div>
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={staggerChildren}
          >
            {/* Basic Plan */}
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
                  <CardTitle className="font-serif">STARTER</CardTitle>
                  <div className="text-3xl font-bold mt-2">$29<span className="text-lg text-muted-foreground">/mo</span></div>
                  <CardDescription>
                    Perfect for getting started
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-muted-foreground mb-6">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                      Basic CV templates
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                      1 CV review per month
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                      Email support
                    </li>
                  </ul>
                  <Button className="w-full bg-primary hover:bg-primary/90 uppercase-spaced" asChild>
                    <Link href={user ? "/dashboard" : "/auth"}>GET STARTED</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Pro Plan */}
            <motion.div 
              variants={fadeIn}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="relative overflow-hidden border-2 border-primary hover:shadow-lg transition-all duration-300">
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-sm uppercase-spaced">
                  Popular
                </div>
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="font-serif">PRO</CardTitle>
                  <div className="text-3xl font-bold mt-2">$49<span className="text-lg text-muted-foreground">/mo</span></div>
                  <CardDescription>
                    For serious career builders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-muted-foreground mb-6">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                      Premium CV templates
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                      Unlimited CV reviews
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                      2 consultation calls
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                      Priority support
                    </li>
                  </ul>
                  <Button className="w-full bg-primary hover:bg-primary/90 uppercase-spaced" asChild>
                    <Link href={user ? "/dashboard" : "/auth"}>GET PRO</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div 
              variants={fadeIn}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="relative overflow-hidden border hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="font-serif">ENTERPRISE</CardTitle>
                  <div className="text-3xl font-bold mt-2">$99<span className="text-lg text-muted-foreground">/mo</span></div>
                  <CardDescription>
                    Complete career transformation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-muted-foreground mb-6">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                      All Pro features
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                      Weekly consultations
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                      LinkedIn optimization
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                      Career coaching
                    </li>
                  </ul>
                  <Button className="w-full bg-primary hover:bg-primary/90 uppercase-spaced" asChild>
                    <Link href={user ? "/dashboard" : "/auth"}>GET ENTERPRISE</Link>
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