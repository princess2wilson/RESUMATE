import { useEffect, useRef, useState } from "react";
import { Calendar } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ErrorBoundary } from "./error-boundary";

export function ConsultationForm() {
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      // Load Calendly widget script
      const script = document.createElement('script');
      script.src = "https://assets.calendly.com/assets/external/widget.js";
      script.async = true;
      scriptRef.current = script;

      // Initialize Calendly after script loads
      script.onload = () => {
        // Wait a brief moment to ensure Calendly is fully loaded
        setTimeout(() => {
          if (!(window as any).Calendly) {
            setError('Could not load the scheduling widget. Please refresh the page.');
            setIsLoading(false);
            return;
          }

          const parentElement = document.querySelector('.calendly-inline-widget');
          if (!parentElement) {
            setError('Could not initialize the booking widget. Please refresh the page.');
            setIsLoading(false);
            return;
          }

          try {
            (window as any).Calendly.initInlineWidget({
              url: 'https://calendly.com/resumate/career-consultation',
              parentElement,
              prefill: {},
              utm: {},
            });
            setIsLoading(false);
          } catch (err) {
          console.error('Failed to initialize Calendly:', err);
          setError('Could not initialize the booking widget. Please try again later.');
          setIsLoading(false);
        }
      }, 1000); // Give a 1 second delay for initialization
    };

      script.onerror = () => {
        setError('Failed to load the scheduling widget. Please check your internet connection.');
        setIsLoading(false);
      };

      // Add script to document
      document.body.appendChild(script);
    } catch (err) {
      console.error('Error setting up Calendly:', err);
      setError('Something went wrong. Please try again later.');
      setIsLoading(false);
    }

    return () => {
      // Cleanup: remove script only if it's still in document
      if (scriptRef.current && document.body.contains(scriptRef.current)) {
        document.body.removeChild(scriptRef.current);
      }
    };
  }, []);

  const content = (
    <div className="relative">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div 
        className="calendly-inline-widget" 
        style={{ minWidth: '320px', height: '700px' }} 
      />
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="text-center">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
            <p className="text-lg font-medium">Loading calendar...</p>
            <p className="text-sm text-muted-foreground">Please wait while we set up your booking experience</p>
          </div>
        </div>
      )}
    </div>
  );

  return <ErrorBoundary>{content}</ErrorBoundary>;
}