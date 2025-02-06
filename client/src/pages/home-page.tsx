import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { BookOpen, Users, LogOut, ArrowRight, FileText, Sparkles, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

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
  const { toast } = useToast();
  const [email, setEmail] = useState("");

  const scrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Success!",
      description: "Your career guide is on its way to your inbox!",
    });
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b fixed w-full top-0 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 z-50">
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
                  <Link href="/cv-submission">SUBMIT YOUR CV FOR REVIEW</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Updated with Digital Library Promotion */}
      <motion.section
        className="relative min-h-screen flex items-center pt-16"
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
                <motion.div
                  className="flex items-center justify-center gap-2"
                  variants={slideIn}
                >
                  <p className="uppercase-spaced text-primary">
                    TRANSFORM YOUR CAREER TODAY
                  </p>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    <Sparkles className="w-4 h-4 mr-1" />
                    50% OFF ALL RESOURCES
                  </Badge>
                </motion.div>
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
                  <Link href="/resources">
                    VIEW DIGITAL LIBRARY
                    <Sparkles className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Promotional Section */}
      <motion.section
        className="py-12 bg-primary/5"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerChildren}
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            variants={fadeIn}
          >
            <h2 className="text-3xl font-serif font-bold mb-4">🎉 Limited Time Offer!</h2>
            <p className="text-xl mb-2">
              Get your CV reviewed with <span className="font-bold text-primary">70% OFF</span>
            </p>
            <p className="text-muted-foreground">
              Only available for the first 10 submissions - Don't miss out!
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Free Resource Section */}
      <motion.section
        className="py-24 bg-gradient-to-b from-background to-muted"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerChildren}
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            variants={fadeIn}
          >
            <h2 className="text-3xl font-serif font-bold mb-4">Get Your Free Career Guide</h2>
            <p className="text-muted-foreground mb-8">
              Download our comprehensive guide packed with insider tips for crafting
              the perfect CV and acing your interviews.
            </p>
            <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                required
              />
              <Button type="submit" className="uppercase-spaced">
                <Mail className="w-4 h-4 mr-2" />
                GET FREE GUIDE
              </Button>
            </form>
          </motion.div>
        </div>
      </motion.section>

      {/* Services Section - Updated Digital Resources Card */}
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
                  <CardDescription>Professional CV Review & Feedback</CardDescription>
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
                    <Link href="/cv-submission">GET REVIEW</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Digital Resources - Updated with promotion */}
            <motion.div
              variants={fadeIn}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="relative overflow-hidden border hover:shadow-lg transition-all duration-300">
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    <Sparkles className="w-4 h-4 mr-1" />
                    50% OFF
                  </Badge>
                </div>
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="font-serif">RESOURCE LIBRARY</CardTitle>
                  <CardDescription>Premium Templates & Guides</CardDescription>
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
                    <Link href="/resources">
                      ACCESS LIBRARY
                      <Sparkles className="w-4 h-4 ml-2" />
                    </Link>
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
                    <Link href="/consultations">BOOK NOW</Link>
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