import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useStripeCheckout() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      priceId,
      planType,
    }: {
      priceId: string;
      planType: string;
    }) => {
      const res = await apiRequest("POST", "/api/create-checkout-session", {
        priceId,
        planType,
      });
      const data = await res.json();
      window.location.href = data.url;
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
