import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, Check, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

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
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <Card>
            <CardHeader>
              <CardTitle>Submit Your CV for Expert Review</CardTitle>
              <CardDescription>
                Get professional feedback to enhance your career prospects
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

                <div className="space-y-4">
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
                      <>Uploading...</>
                    ) : (
                      <>Submit for Review</>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}