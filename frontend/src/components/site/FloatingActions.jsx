import { useState, useEffect } from "react";
import { MessageCircle, Phone, X } from "lucide-react";
import { BUSINESS } from "@/data/content";

export const FloatingActions = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const waText = encodeURIComponent(
    "Hi Green Tara Wellness! I'd like to book an appointment / ask about your services."
  );

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <a
        data-testid="floating-call-btn"
        href={`tel:${BUSINESS.phone}`}
        className={`w-13 h-13 p-3.5 rounded-full bg-[#1C3F35] text-[#FAF7F2] shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-300 ${
          show ? "opacity-100" : "opacity-0 pointer-events-none translate-y-3"
        }`}
        aria-label="Call us"
      >
        <Phone size={22} />
      </a>
      <a
        data-testid="floating-whatsapp-btn"
        href={`https://wa.me/${BUSINESS.whatsapp}?text=${waText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-15 h-15 p-4 rounded-full bg-[#25D366] text-white shadow-xl flex items-center justify-center hover:scale-110 transition-all duration-300 animate-wa-pulse"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={26} className="fill-white" />
      </a>
    </div>
  );
};
