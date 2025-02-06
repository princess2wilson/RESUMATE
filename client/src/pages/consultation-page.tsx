import { Link } from "wouter";
import { ConsultationForm } from "@/components/consultation-form";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Calendar, Video, Users } from "lucide-react";

export default function ConsultationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/">
              <span className="font-serif text-xl font-bold text-primary cursor-pointer">
                RESUMATE
              </span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif font-bold mb-4">Book Your Consultation</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Schedule a one-on-one session with our career experts to discuss your professional growth
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Calendly Widget - Takes up more space */}
            <div className="lg:col-span-3">
              <Card>
                <CardContent className="p-6">
                  <ConsultationForm />
                </CardContent>
              </Card>
            </div>

            {/* Features - Takes up less space */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Video className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Virtual Sessions</h3>
                        <p className="text-sm text-muted-foreground">
                          Meet via video conference from anywhere in the world
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Instant Confirmation</h3>
                        <p className="text-sm text-muted-foreground">
                          Receive immediate calendar invites and meeting details
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Expert Guidance</h3>
                        <p className="text-sm text-muted-foreground">
                          One-on-one sessions with experienced career professionals
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}