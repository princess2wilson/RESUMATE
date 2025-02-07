
import { useEffect } from "react";
import { Calendar } from "lucide-react";

export function ConsultationForm() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="calendly-inline-widget" style={{ minWidth: '320px', height: '700px' }}>
      <iframe
        src="https://calendly.com/princess2wilson/30min"
        width="100%"
        height="100%"
        frameBorder="0"
        title="Select a time for your consultation"
      />
    </div>
  );
}
