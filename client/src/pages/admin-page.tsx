import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { CVReview } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Clock,
  Lock,
  FileText,
  Users,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Send
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AdminPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [feedback, setFeedback] = useState<string>("");
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);

  const { data: reviews, isLoading: isLoadingReviews } = useQuery<(CVReview & { userEmail?: string; firstName?: string })[]>({
    queryKey: ["/api/admin/cv-reviews"],
  });

  const feedbackMutation = useMutation({
    mutationFn: async ({
      id,
      feedback,
    }: {
      id: number;
      feedback: string;
    }) => {
      const res = await apiRequest("POST", `/api/admin/cv-reviews/${id}/feedback`, {
        feedback,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cv-reviews"] });
      setFeedback("");
      setSelectedReviewId(null);
      toast({
        title: "Feedback Submitted",
        description: "The CV review feedback has been sent successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-[90%] max-w-md">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-destructive" />
              <h1 className="text-2xl font-bold">Access Denied</h1>
              <p className="text-muted-foreground">
                You don't have permission to access this page.
              </p>
              <Button asChild>
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Return Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate statistics
  const totalReviews = reviews?.length || 0;
  const pendingReviews = reviews?.filter(r => r.status === "pending").length || 0;
  const completedReviews = reviews?.filter(r => r.status === "completed").length || 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl font-bold text-primary">
                RESUMATE
              </span>
              <Badge variant="secondary">Admin Panel</Badge>
            </div>
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoadingReviews ? <Skeleton className="h-8 w-20" /> : totalReviews}</div>
              <p className="text-xs text-muted-foreground">
                All time CV review submissions
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoadingReviews ? <Skeleton className="h-8 w-20" /> : pendingReviews}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting feedback
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Reviews</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoadingReviews ? <Skeleton className="h-8 w-20" /> : completedReviews}</div>
              <p className="text-xs text-muted-foreground">
                Successfully reviewed CVs
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Reviews Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              CV Review Management
            </CardTitle>
            <CardDescription>
              Manage and review submitted CVs from users
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingReviews ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : reviews?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>No CV reviews submitted yet</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Promotional</TableHead>
                      <TableHead>File</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reviews?.map((review) => (
                      <TableRow key={review.id}>
                        <TableCell>
                          {format(new Date(review.createdAt), "PPP")}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{review.firstName || "N/A"}</span>
                            <span className="text-sm text-muted-foreground">{review.userEmail || "N/A"}</span>
                            <span className="text-xs text-muted-foreground">ID: {review.userId}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={review.status === "completed" ? "default" : "secondary"}
                            className={review.status === "completed" ? "bg-green-100 text-green-800" : ""}
                          >
                            {review.status === "completed" ? (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            ) : (
                              <Clock className="w-3 h-3 mr-1" />
                            )}
                            {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {review.isPromotional ? (
                            <Badge variant="default">70% OFF</Badge>
                          ) : (
                            <Badge variant="outline">Regular</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button variant="link" asChild className="p-0">
                            <a
                              href={`/api/cv-reviews/download/${review.fileUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1"
                            >
                              <FileText className="w-4 h-4" />
                              View CV
                            </a>
                          </Button>
                        </TableCell>
                        <TableCell>
                          {review.status === "pending" ? (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  onClick={() => setSelectedReviewId(review.id)}
                                  variant="outline"
                                  className="hover:bg-primary/5"
                                >
                                  Add Feedback
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Provide CV Review Feedback</DialogTitle>
                                </DialogHeader>
                                <form
                                  onSubmit={(e) => {
                                    e.preventDefault();
                                    if (selectedReviewId) {
                                      feedbackMutation.mutateAsync({
                                        id: selectedReviewId,
                                        feedback,
                                      });
                                    }
                                  }}
                                  className="space-y-4 mt-4"
                                >
                                  <Textarea
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    placeholder="Enter detailed feedback for the CV..."
                                    className="min-h-[200px] resize-none"
                                  />
                                  <div className="flex justify-end gap-4">
                                    <Button
                                      type="submit"
                                      disabled={feedbackMutation.isPending || !feedback.trim()}
                                      className="gap-2"
                                    >
                                      {feedbackMutation.isPending ? (
                                        <>
                                          <Loader2 className="w-4 h-4 animate-spin" />
                                          Submitting...
                                        </>
                                      ) : (
                                        <>
                                          <Send className="w-4 h-4" />
                                          Submit Feedback
                                        </>
                                      )}
                                    </Button>
                                  </div>
                                </form>
                              </DialogContent>
                            </Dialog>
                          ) : (
                            <Badge variant="secondary">
                              <Lock className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}