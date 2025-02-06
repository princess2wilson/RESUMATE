import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, Check, Lock, Star, Clock, Award, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { formatPrice, calculateDiscountedPrice } from "@/lib/currency";
import { Badge } from "@/components/ui/badge";

export default function CVSubmissionPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();

  // Redirect to auth if not logged in
  if (!user) {
    setLocation('/auth?redirect=/cv-submission');
    return null;
  }

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiRequest("POST", "/api/cv-review", formData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "CV Submitted Successfully",
        description: "We'll review your CV and notify you when feedback is ready. You'll need to complete the payment to access the detailed review.",
      });
      setLocation('/dashboard');
    },
    onError: (error: Error) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    uploadMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/">
              <span className="font-serif text-xl font-bold text-primary cursor-pointer">
                RESUMATE
              </span>
            </Link>
            <Button variant="outline" asChild>
              <Link href="/">Explore More Services</Link>
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Hero Section */}
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <Star className="w-3 h-3 mr-1" />
              LIMITED TIME OFFER
            </Badge>
            <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-4">
              Get Expert CV Review & Feedback
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
              Transform your CV with professional insights from industry experts.
              Stand out to employers and increase your interview chances.
            </p>
            <div className="flex justify-center items-center gap-2 text-2xl font-bold">
              <span className="text-primary">{formatPrice(calculateDiscountedPrice(9900, 70))}</span>
              <span className="text-sm text-muted-foreground line-through">{formatPrice(9900)}</span>
              <Badge variant="secondary" className="bg-primary/10 text-primary ml-2">
                SAVE 70%
              </Badge>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle>Why Choose Our CV Review Service?</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-medium mb-1">Expert Review</h3>
                      <p className="text-sm text-muted-foreground">
                        Get detailed feedback from industry professionals who know what employers look for
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-medium mb-1">Quick Turnaround</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive comprehensive feedback within 48 hours
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Star className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-medium mb-1">Detailed Analysis</h3>
                      <p className="text-sm text-muted-foreground">
                        Get section-by-section improvements and industry-specific advice
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Upload Form */}
            <Card>
              <CardHeader>
                <CardTitle>Submit Your CV Now</CardTitle>
                <CardDescription>
                  Start with a free submission - pay only when you're ready to access the feedback
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center space-y-4">
                    <div className="flex justify-center">
                      <input
                        type="file"
                        id="cv-upload"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileSelect}
                      />
                      <label
                        htmlFor="cv-upload"
                        className="cursor-pointer flex flex-col items-center space-y-2"
                      >
                        {selectedFile ? (
                          <>
                            <Check className="h-12 w-12 text-green-500" />
                            <span className="text-sm text-muted-foreground">
                              {selectedFile.name}
                            </span>
                          </>
                        ) : (
                          <>
                            <Upload className="h-12 w-12 text-gray-400" />
                            <span className="text-sm text-muted-foreground">
                              Click to upload your CV (PDF, DOC, DOCX)
                            </span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      How it works
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                        Upload your CV now - no payment required
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                        Our expert team will review within 48 hours
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                        You'll be notified when the review is ready
                      </li>
                      <li className="flex items-center gap-2">
                        <Lock className="w-3 h-3 text-primary/70" />
                        Complete payment to access your detailed feedback
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                        First 10 submissions get 70% OFF!
                      </li>
                    </ul>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!selectedFile || uploadMutation.isPending}
                  >
                    {uploadMutation.isPending ? (
                      "Uploading..."
                    ) : (
                      <>
                        Submit for Review
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Trust Indicators */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Join thousands of professionals who've improved their career prospects with our CV review service.
              <br />
              Questions? <Link href="/contact" className="text-primary hover:underline">Contact our support team</Link>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}