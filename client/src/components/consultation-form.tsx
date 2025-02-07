import { useEffect } from "react";
import { Calendar } from "lucide-react";

export function ConsultationForm() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;

    // Add script to document
    document.body.appendChild(script);

    // Initialize Calendly after script loads
    script.onload = () => {
      if ((window as any).Calendly) {
        (window as any).Calendly.initInlineWidget({
          url: 'https://calendly.com/princess2wilson/30min',
          parentElement: document.querySelector('.calendly-inline-widget'),
          prefill: {},
          utm: {}
        });
      }
    };

    return () => {
      // Cleanup
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div 
      className="calendly-inline-widget" 
      data-url="https://calendly.com/princess2wilson/30min"
      style={{ minWidth: '320px', height: '700px' }} 
    />
  );
}