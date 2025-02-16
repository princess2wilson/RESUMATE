import { useEffect, useRef, useState } from "react";
import { Calendar } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ErrorBoundary } from "./error-boundary";

export function ConsultationForm() {
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const calendlyUrl = import.meta.env.VITE_CALENDLY_URL;
    console.log('Calendly URL:', calendlyUrl); // Debug log

    if (!calendlyUrl) {
      setError('Calendly URL is not configured');
      setIsLoading(false);
      return;
    }

    let isScriptLoaded = false;
    let isMounted = true;

    const initializeCalendly = () => {
      if (!isMounted) return;

      try {
        const Calendly = (window as any).Calendly;
        if (!Calendly) {
          console.error('Calendly not found in window object');
          setError('Could not initialize the scheduling widget. Please refresh the page.');
          setIsLoading(false);
          return;
        }

        if (!calendarRef.current) {
          console.error('Calendar container not found');
          setError('Could not initialize the scheduling widget. Please refresh the page.');
          setIsLoading(false);
          return;
        }

        console.log('Initializing Calendly widget with URL:', calendlyUrl);

        // Clear any existing widgets
        while (calendarRef.current.firstChild) {
          calendarRef.current.removeChild(calendarRef.current.firstChild);
        }

        // Initialize new widget
        Calendly.initInlineWidget({
          url: calendlyUrl,
          parentElement: calendarRef.current,
          prefill: {},
          utm: {},
        });

        console.log('Calendly widget initialized');
        setIsLoading(false);
        setError(null);
      } catch (err) {
        console.error('Error initializing Calendly widget:', err);
        setError('Could not initialize the scheduling widget. Please try again later.');
        setIsLoading(false);
      }
    };

    const loadScript = () => {
      if (isScriptLoaded) return;

      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      script.onload = () => {
        console.log('Calendly script loaded successfully');
        isScriptLoaded = true;
        // Wait for the script to be fully initialized
        setTimeout(initializeCalendly, 1000);
      };
      script.onerror = (e) => {
        console.error('Failed to load Calendly script:', e);
        if (isMounted) {
          setError('Failed to load the scheduling widget. Please check your internet connection.');
          setIsLoading(false);
        }
      };

      document.body.appendChild(script);
      scriptRef.current = script;
    };

    loadScript();

    return () => {
      isMounted = false;
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
        ref={calendarRef}
        className="calendly-inline-widget"
        style={{ minWidth: '320px', height: '700px' }} 
      />
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