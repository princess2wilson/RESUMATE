declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: {
        url: string;
        parentElement: HTMLElement;
      }) => void;
    };
  }
}

import { Calendar } from "lucide-react";
import { useEffect, useState, useRef } from "react";

export function ConsultationForm() {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Calendly widget
    const script = document.querySelector('script[src*="calendly.com/assets/external/widget.js"]');

    const initializeWidget = () => {
      if (window.Calendly && containerRef.current) {
        window.Calendly.initInlineWidget({
          url: 'https://calendly.com/princess2wilson?hide_gdpr_banner=1',
          parentElement: containerRef.current
        });
        setIsLoading(false);
      }
    };

    if (script) {
      if ((script as HTMLScriptElement).loaded) {
        initializeWidget();
      } else {
        script.addEventListener('load', initializeWidget);
      }
    }

    return () => {
      if (script) {
        script.removeEventListener('load', initializeWidget);
      }
    };
  }, []);

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <Calendar className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}
      <div 
        ref={containerRef}
        className="calendly-inline-widget h-[650px]"
      />
    </div>
  );
}