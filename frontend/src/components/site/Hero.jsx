import { motion } from "framer-motion";
import { Star, Phone } from "lucide-react";
import { BUSINESS, IMAGES } from "@/data/content";

export const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <img
        src={IMAGES.hero}
        alt="Green Tara Wellness luxury spa sanctuary"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#142D26]/70 via-[#1C3F35]/55 to-[#1C3F35]/75" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FAF7F2]/10 border border-[#D4AF37]/40 backdrop-blur-sm mb-7"
        >
          <Star size={15} className="text-[#D4AF37] fill-[#D4AF37]" />
          <span className="text-[#FAF7F2] text-xs md:text-sm tracking-wide">
            {BUSINESS.rating} ★ rated · Trusted by Chennai families
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-[#D4AF37] text-xs md:text-sm tracking-[0.3em] uppercase font-semibold mb-5"
        >
          Green Tara Wellness · Valasaravakkam, Chennai
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="font-serif-display text-5xl sm:text-6xl lg:text-7xl font-light text-[#FAF7F2] leading-[1.05] tracking-tight"
        >
          Where Healing
          <br />
          Meets <span className="italic text-[#D4AF37]">Tranquility</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="mt-7 text-base md:text-lg text-[#FAF7F2]/85 max-w-xl mx-auto leading-relaxed"
        >
          {BUSINESS.subtitle} Step into a digital sanctuary of therapeutic care,
          serenity and rejuvenation in the heart of Chennai.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            data-testid="hero-book-btn"
            onClick={() => document.querySelector("#booking")?.scrollIntoView({ behavior: "smooth" })}
            className="w-full sm:w-auto inline-flex items-center justify-center bg-[#D4AF37] text-[#1C3F35] px-9 py-4 rounded-full hover:bg-[#FAF7F2] transition-all duration-300 font-semibold tracking-wide"
          >
            Book Your Appointment
          </button>
          <a
            data-testid="hero-call-btn"
            href={`tel:${BUSINESS.phone}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[#FAF7F2]/40 text-[#FAF7F2] px-9 py-4 rounded-full hover:bg-[#FAF7F2] hover:text-[#1C3F35] transition-all duration-300 backdrop-blur-sm"
          >
            <Phone size={17} /> Call {BUSINESS.phoneDisplay}
          </a>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FAF7F2] to-transparent" />
    </section>
  );
};
