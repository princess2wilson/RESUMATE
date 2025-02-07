import { useEffect, useRef } from "react";
import { Calendar } from "lucide-react";

export function ConsultationForm() {
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    // Create script element
    const script = document.createElement('script');
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    scriptRef.current = script;

    // Add script to document
    document.body.appendChild(script);

    // Initialize Calendly after script loads
    script.onload = () => {
      if ((window as any).Calendly) {
        (window as any).Calendly.initInlineWidget({
          url: 'https://calendly.com/resumate/career-consultation',
          parentElement: document.querySelector('.calendly-inline-widget'),
          prefill: {},
          utm: {}
        });
      }
    };

    return () => {
      // Only remove the script if it's still in the document
      if (scriptRef.current && document.body.contains(scriptRef.current)) {
        document.body.removeChild(scriptRef.current);
      }
    };
  }, []);

  return (
    <div 
      className="calendly-inline-widget" 
      data-url="https://calendly.com/resumate/career-consultation"
      style={{ minWidth: '320px', height: '700px' }} 
    />
  );
}