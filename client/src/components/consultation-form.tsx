import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";

export function ConsultationForm() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize Calendly widget
    const script = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
    if (script) {
      script.onload = () => {
        if (window.Calendly) {
          setIsLoading(false);
        }
      };
    }
  }, []);

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <Calendar className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}
      <div 
        className="calendly-inline-widget h-[650px]"
        data-url="https://calendly.com/princess2wilson?hide_gdpr_banner=1"
      />
    </div>
  );
}