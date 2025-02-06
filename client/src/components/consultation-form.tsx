import { Calendar } from "lucide-react";

export function ConsultationForm() {
  return (
    <div className="calendly-inline-widget h-[650px]" 
      data-url="https://calendly.com/your-calendly-link?hide_gdpr_banner=1"
    />
  );
}