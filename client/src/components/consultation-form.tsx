import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

export function ConsultationForm() {
  const handleBooking = () => {
    // Replace with your Calendly URL
    window.open('https://calendly.com/your-calendly-link', '_blank');
  };

  return (
    <div className="text-center">
      <Button 
        onClick={handleBooking}
        size="lg"
        className="w-full bg-primary hover:bg-primary/90"
      >
        <Calendar className="w-5 h-5 mr-2" />
        Schedule on Calendly
      </Button>
      <p className="text-sm text-muted-foreground mt-4">
        You'll be redirected to Calendly to schedule your consultation
      </p>
    </div>
  );
}