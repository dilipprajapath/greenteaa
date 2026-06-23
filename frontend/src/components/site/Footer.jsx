import { Phone, Mail, MapPin, Clock, Instagram, Facebook } from "lucide-react";
import { BUSINESS, IMAGES } from "@/data/content";

export const Footer = () => {
  return (
    <footer className="bg-[#1C3F35] text-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid md:grid-cols-3 gap-12">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <img src={IMAGES.logo} alt="Green Tara Wellness" className="h-12 w-12 object-contain" />
            <span className="font-serif-display text-2xl">
              Green Tara
              <span className="block text-[10px] tracking-[0.35em] uppercase text-[#D4AF37]">Wellness</span>
            </span>
          </div>
          <p className="text-[#FAF7F2]/70 text-sm leading-relaxed max-w-xs">
            Where Healing Meets Tranquility. Your stress-relief sanctuary in Valasaravakkam,
            Chennai — inspired by the compassionate Green Tara.
          </p>
          <div className="flex gap-3 mt-6">
            <a
              href={`https://wa.me/${BUSINESS.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="footer-instagram"
              className="w-10 h-10 rounded-full border border-[#FAF7F2]/20 flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#1C3F35] hover:border-[#D4AF37] transition-all"
            >
              <Instagram size={18} />
            </a>
            <a
              href={BUSINESS.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="footer-facebook"
              className="w-10 h-10 rounded-full border border-[#FAF7F2]/20 flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#1C3F35] hover:border-[#D4AF37] transition-all"
            >
              <Facebook size={18} />
            </a>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-serif-display text-xl mb-5 text-[#D4AF37]">Visit & Contact</h4>
          <ul className="space-y-4 text-sm text-[#FAF7F2]/80">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-[#D4AF37] mt-0.5 flex-shrink-0" />
              <span>
                {BUSINESS.addressLine1}
                <br />
                {BUSINESS.addressLine2}
                <br />
                {BUSINESS.addressLine3}
              </span>
            </li>
            <li>
              <a
                href={`tel:${BUSINESS.phone}`}
                data-testid="footer-call-link"
                className="flex items-center gap-3 hover:text-[#D4AF37] transition-colors"
              >
                <Phone size={18} className="text-[#D4AF37]" /> {BUSINESS.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${BUSINESS.email}`}
                data-testid="footer-email-link"
                className="flex items-center gap-3 hover:text-[#D4AF37] transition-colors break-all"
              >
                <Mail size={18} className="text-[#D4AF37] flex-shrink-0" /> {BUSINESS.email}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Clock size={18} className="text-[#D4AF37]" /> {BUSINESS.hours} · {BUSINESS.days}
            </li>
          </ul>
        </div>

        {/* Map */}
        <div>
          <h4 className="font-serif-display text-xl mb-5 text-[#D4AF37]">Find Us</h4>
          <div className="rounded-2xl overflow-hidden border border-[#FAF7F2]/15 h-56">
            <iframe
              title="Green Tara Wellness location"
              data-testid="footer-map"
              src={BUSINESS.mapEmbed}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-[#FAF7F2]/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#FAF7F2]/50">
          <p>© {new Date().getFullYear()} Green Tara Wellness. All rights reserved.</p>
          <a href="/admin" data-testid="footer-admin-link" className="hover:text-[#D4AF37] transition-colors">
            Admin Login
          </a>
        </div>
      </div>
    </footer>
  );
};
