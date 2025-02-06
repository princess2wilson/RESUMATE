import { Link } from "wouter";
import { ConsultationForm } from "@/components/consultation-form";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Calendar, Video, Users } from "lucide-react";
import { formatPrice, calculateDiscountedPrice } from "@/lib/currency";

export default function ConsultationPage() {
  const basePrice = 14900; // £149.00
  const discountedPrice = calculateDiscountedPrice(basePrice, 50);

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
            <h1 className="text-4xl font-serif font-bold mb-4">Expert Career Consultation</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Book a one-on-one session with our career specialists to review your CV, 
              prepare for interviews, and develop your professional growth strategy
            </p>
            <div className="mt-4">
              <span className="text-3xl font-bold">{formatPrice(discountedPrice)}</span>
              <span className="text-lg text-muted-foreground line-through ml-2">
                {formatPrice(basePrice)}
              </span>
              <span className="text-sm text-muted-foreground ml-2">
                (Save 50%)
              </span>
            </div>
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
                        <h3 className="font-semibold mb-1">Personalized 1:1 Sessions</h3>
                        <p className="text-sm text-muted-foreground">
                          In-depth video consultations focused on your specific career goals and challenges
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
                        <h3 className="font-semibold mb-1">Flexible Scheduling</h3>
                        <p className="text-sm text-muted-foreground">
                          Choose from available time slots that fit your schedule, with instant confirmation
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
                        <h3 className="font-semibold mb-1">Industry Expertise</h3>
                        <p className="text-sm text-muted-foreground">
                          Gain insights from experienced professionals who understand your industry's requirements
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