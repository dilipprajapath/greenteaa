import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { BUSINESS, IMAGES } from "@/data/content";

const LINKS = [
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Gallery", href: "#gallery" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (href) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      data-testid="site-navbar"
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-xl bg-[#FAF7F2]/85 border-b border-[#1C3F35]/10 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <a
          href="#home"
          data-testid="nav-logo"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center gap-3"
        >
          <img src={IMAGES.logo} alt="Green Tara Wellness" className="h-11 w-11 object-contain" />
          <span
            className={`font-serif-display text-xl md:text-2xl tracking-wide leading-none transition-colors ${
              scrolled ? "text-[#1C3F35]" : "text-[#FAF7F2]"
            }`}
          >
            Green Tara
            <span className="block text-[10px] tracking-[0.35em] uppercase font-sans text-[#D4AF37]">
              Wellness
            </span>
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-9">
          {LINKS.map((l) => (
            <button
              key={l.href}
              data-testid={`nav-link-${l.label.toLowerCase()}`}
              onClick={() => go(l.href)}
              className={`text-sm tracking-wide transition-colors hover:text-[#D4AF37] ${
                scrolled ? "text-[#1C3F35]" : "text-[#FAF7F2]/90"
              }`}
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            data-testid="nav-book-btn"
            onClick={() => go("#booking")}
            className="hidden sm:inline-flex items-center justify-center bg-[#1C3F35] text-[#FAF7F2] px-6 py-3 rounded-full hover:bg-[#D4AF37] hover:text-[#1C3F35] transition-all duration-300 font-medium text-sm tracking-wide"
          >
            Book Appointment
          </button>
          <button
            data-testid="nav-mobile-toggle"
            onClick={() => setOpen((o) => !o)}
            className={`lg:hidden p-2 rounded-full ${scrolled ? "text-[#1C3F35]" : "text-[#FAF7F2]"}`}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden mt-3 mx-4 rounded-2xl bg-[#FAF7F2] shadow-xl border border-[#1C3F35]/10 p-4 flex flex-col gap-1">
          {LINKS.map((l) => (
            <button
              key={l.href}
              data-testid={`nav-mobile-link-${l.label.toLowerCase()}`}
              onClick={() => go(l.href)}
              className="text-left px-4 py-3 rounded-xl text-[#1C3F35] hover:bg-[#8EAC9A]/15 transition-colors"
            >
              {l.label}
            </button>
          ))}
          <button
            data-testid="nav-mobile-book-btn"
            onClick={() => go("#booking")}
            className="mt-2 bg-[#1C3F35] text-[#FAF7F2] px-6 py-3 rounded-full font-medium"
          >
            Book Appointment
          </button>
        </div>
      )}
    </header>
  );
};
