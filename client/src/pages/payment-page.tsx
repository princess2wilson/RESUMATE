
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CVReview } from "@shared/schema";
import { useStripeCheckout } from "@/hooks/use-stripe-checkout";
import { formatPrice } from "@/lib/currency";
import { Lock, CheckCircle, ArrowLeft } from "lucide-react";

export default function PaymentPage() {
  const { user } = useAuth();
  const [, params] = useLocation();
  const reviewId = parseInt(params.reviewId);
  const { startCheckout } = useStripeCheckout();

  const { data: review } = useQuery<CVReview>({
    queryKey: ["/api/cv-reviews", reviewId],
    enabled: !!reviewId,
  });

  if (!user || !review) return null;

  const handlePayment = () => {
    startCheckout({
      productId: "cv-review",
      reviewId: review.id,
    });
  };

  const isExpired = review.paymentDeadline && new Date(review.paymentDeadline) < new Date();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Button variant="ghost" className="mb-8" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Complete Your Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isExpired ? (
                <div className="text-center py-8">
                  <div className="text-muted-foreground mb-4">
                    This review has expired. Please submit a new CV for review.
                  </div>
                  <Button asChild>
                    <Link href="/cv-submission">Submit New CV</Link>
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-6">
                    <div>
                      <div className="text-2xl font-bold">
                        {formatPrice(9900)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Professional CV Review & Feedback
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <span className="text-sm">Detailed Analysis & Scoring</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <span className="text-sm">Industry-specific Advice</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        <span className="text-sm">48-hour Turnaround</span>
                      </div>
                    </div>

                    {review.paymentDeadline && (
                      <div className="text-sm text-muted-foreground">
                        Time remaining: {Math.max(0, Math.floor((new Date(review.paymentDeadline).getTime() - Date.now()) / (1000 * 60 * 60)))} hours
                      </div>
                    )}

                    <Button 
                      className="w-full" 
                      onClick={handlePayment}
                    >
                      Pay Now
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
