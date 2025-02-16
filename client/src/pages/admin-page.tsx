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
import { Textarea } from "@/components/ui/textarea";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { CVReview } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Lock } from "lucide-react";

export default function AdminPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [feedback, setFeedback] = useState<string>("");
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);

  const { data: reviews } = useQuery<(CVReview & { userEmail?: string; firstName?: string })[]>({
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
        title: "Success",
        description: "Feedback submitted successfully",
      });
    },
  });

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-4">
              You don't have permission to access this page.
            </p>
            <Button asChild>
              <Link href="/">Return Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>CV Reviews</CardTitle>
          </CardHeader>
          <CardContent>
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
                      <Badge variant={review.status === "completed" ? "default" : "secondary"}>
                        {review.status === "completed" ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        {review.status}
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
                      <Button variant="link" asChild>
                        <a 
                          href={`/api/cv-reviews/download/${review.fileUrl}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          View CV
                        </a>
                      </Button>
                    </TableCell>
                    <TableCell>
                      {review.status === "pending" ? (
                        <Button
                          onClick={() => setSelectedReviewId(review.id)}
                          variant="outline"
                        >
                          Add Feedback
                        </Button>
                      ) : (
                        <Badge variant="secondary">
                          <Lock className="w-3 h-3 mr-1" />
                          Locked
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {selectedReviewId && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Add Feedback</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    feedbackMutation.mutateAsync({
                      id: selectedReviewId,
                      feedback,
                    });
                  }}
                  className="space-y-4"
                >
                  <Textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Enter your feedback..."
                    className="min-h-[150px]"
                  />
                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      disabled={feedbackMutation.isPending}
                    >
                      Submit Feedback
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSelectedReviewId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}