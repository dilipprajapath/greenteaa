import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { TESTIMONIALS } from "@/data/content";

export const Testimonials = () => {
  const [i, setI] = useState(0);
  const prev = () => setI((p) => (p - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => setI((p) => (p + 1) % TESTIMONIALS.length);
  const t = TESTIMONIALS[i];

  return (
    <section id="testimonials" className="py-20 md:py-32">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <p className="text-[#D4AF37] text-xs md:text-sm tracking-[0.25em] uppercase font-semibold mb-4">
          Trusted by Chennai Families
        </p>
        <h2 className="font-serif-display text-3xl md:text-4xl lg:text-5xl font-light text-[#1C3F35] leading-tight mb-12">
          Words from our guests
        </h2>

        <div className="relative bg-[#8EAC9A]/10 rounded-3xl p-9 md:p-14 border border-[#1C3F35]/5">
          <Quote size={56} className="text-[#D4AF37]/40 mx-auto mb-6" />
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(5)].map((_, s) => (
                  <Star key={s} size={18} className="text-[#D4AF37] fill-[#D4AF37]" />
                ))}
              </div>
              <p
                data-testid="testimonial-quote"
                className="font-serif-display text-xl md:text-3xl font-light text-[#1C3F35] leading-snug italic"
              >
                “{t.quote}”
              </p>
              <p className="mt-8 text-[#1C3F35] font-medium">{t.name}</p>
              <p className="text-sm text-[#4A554D]">{t.role}</p>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-4 mt-9">
            <button
              data-testid="testimonial-prev"
              onClick={prev}
              className="w-11 h-11 rounded-full border border-[#1C3F35]/20 flex items-center justify-center text-[#1C3F35] hover:bg-[#1C3F35] hover:text-[#FAF7F2] transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-2">
              {TESTIMONIALS.map((dot, d) => (
                <button
                  key={dot.name}
                  onClick={() => setI(d)}
                  className={`h-2 rounded-full transition-all ${d === i ? "w-7 bg-[#D4AF37]" : "w-2 bg-[#1C3F35]/20"}`}
                  aria-label={`Go to testimonial ${d + 1}`}
                />
              ))}
            </div>
            <button
              data-testid="testimonial-next"
              onClick={next}
              className="w-11 h-11 rounded-full border border-[#1C3F35]/20 flex items-center justify-center text-[#1C3F35] hover:bg-[#1C3F35] hover:text-[#FAF7F2] transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
