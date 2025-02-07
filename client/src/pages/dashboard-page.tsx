import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { CVReview } from "@shared/schema";
import { Upload, FileText, Check, Clock, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // Add state for preview URL

  const { data: reviews, isLoading: isLoadingReviews } = useQuery<CVReview[]>({
    queryKey: ["/api/cv-reviews"],
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      // Validate file type
      const allowedTypes = ['.pdf', '.doc', '.docx'];
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (!allowedTypes.includes(fileExtension)) {
        throw new Error('Invalid file type. Please upload a PDF, DOC, or DOCX file.');
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await apiRequest("POST", "/api/cv-review", formData);
      if (!response.ok) {
        throw new Error('Failed to upload CV. Please try again.');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cv-reviews"] });
      setFile(null);
      toast({
        title: "CV Uploaded Successfully! 🎉",
        description: "Your CV has been submitted for review. We'll notify you once it's ready.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // If user is not authenticated, we shouldn't show this page
  if (!user) {
    return null; // The ProtectedRoute component will handle the redirect
  }

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
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back {user?.firstName ? user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1) : user?.username}
            </h1>
            <p className="text-muted-foreground">
              Track your CV reviews and upload new documents for professional feedback.
            </p>
          </header>

          {/* Upload Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Submit New CV for Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (file) uploadMutation.mutateAsync(file);
                }}
                className="space-y-4"
              >
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center space-y-4">
                  <div className="flex justify-center">
                    <input
                      type="file"
                      id="cv-upload"
                      className="hidden"
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                      accept=".pdf,.doc,.docx"
                    />
                    <label
                      htmlFor="cv-upload"
                      className="cursor-pointer flex flex-col items-center space-y-2"
                    >
                      {file ? (
                        <>
                          <Check className="h-12 w-12 text-green-500" />
                          <span className="text-sm text-muted-foreground">
                            {file.name}
                          </span>
                        </>
                      ) : (
                        <>
                          <FileText className="h-12 w-12 text-gray-400" />
                          <span className="text-sm text-muted-foreground">
                            Click to upload your CV (PDF, DOC, DOCX)
                          </span>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={!file || uploadMutation.isPending}
                    className="w-full sm:w-auto"
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
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Reviews Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Your CV Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingReviews ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading your reviews...
                </div>
              ) : reviews?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  You haven't submitted any CVs for review yet.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Submitted On</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Feedback</TableHead>
                      <TableHead>Document</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reviews?.map((review) => (
                      <TableRow key={review.id}>
                        <TableCell>
                          {format(new Date(review.createdAt), "PPP")}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={review.status === "completed" ? "default" : "secondary"}
                            className={review.status === "completed" ? "bg-green-100 text-green-800" : ""}
                          >
                            {review.status === "completed" ? (
                              <Check className="w-3 h-3 mr-1" />
                            ) : (
                              <Clock className="w-3 h-3 mr-1" />
                            )}
                            {review.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {review.feedback || (
                            <span className="text-muted-foreground">Pending review</span>
                          )}
                        </TableCell>
                        <TableCell className="space-x-2">
                          <Button 
                            onClick={() => setPreviewUrl(review.fileUrl)} 
                            variant="link" 
                            size="sm"
                          >
                            View Original
                          </Button>
                          {review.status === "completed" && (
                            <Button
                              onClick={() => {
                                if (!review.isPaid) {
                                  toast({
                                    title: "Payment Required",
                                    description: "Please purchase access to view your reviewed CV",
                                    variant: "destructive",
                                  });
                                  return;
                                }
                                setPreviewUrl(review.reviewedFileUrl);
                              }}
                              variant="link"
                              size="sm"
                              className="text-primary"
                            >
                              {review.isPaid ? "View Review" : "Purchase Review ($99)"}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
          {/* Preview Dialog */}
          {previewUrl && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50">
              <div className="bg-white p-4 rounded shadow-lg max-w-lg">
                <iframe src={previewUrl} title="CV Preview" width="100%" height="500" />
                <Button onClick={() => setPreviewUrl(null)} className="mt-4">Close</Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}