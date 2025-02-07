import { useEffect, useRef } from "react";
import { Calendar } from "lucide-react";

export function ConsultationForm() {
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    // Load Calendly widget script
    const script = document.createElement('script');
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    scriptRef.current = script;

    // Show loading state
    const fallback = document.querySelector('.calendly-fallback');
    if (fallback) {
      fallback.classList.remove('hidden');
    }

    // Add script to document
    document.body.appendChild(script);

    // Initialize Calendly after script loads
    script.onload = () => {
      if ((window as any).Calendly) {
        const schedulingUrl = import.meta.env.VITE_CALENDLY_URL || process.env.CALENDLY_SCHEDULING_URL;
        
        if (!schedulingUrl) {
          console.error('Calendly scheduling URL is not set');
          return;
        }

        (window as any).Calendly.initInlineWidget({
          url: schedulingUrl,
          parentElement: document.querySelector('.calendly-inline-widget'),
          prefill: {},
          utm: {}
        });

        // Hide loading state once widget is ready
        if (fallback) {
          fallback.classList.add('hidden');
        }
      }
    };

    return () => {
      // Cleanup: remove script only if it's still in document
      if (scriptRef.current && document.body.contains(scriptRef.current)) {
        document.body.removeChild(scriptRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <div 
        className="calendly-inline-widget" 
        style={{ minWidth: '320px', height: '700px' }} 
      />
      {/* Loading state */}
      <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm calendly-fallback">
        <div className="text-center">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium">Loading calendar...</p>
          <p className="text-sm text-muted-foreground">Please wait while we set up your booking experience</p>
        </div>
      </div>
    </div>
  );
}