import { useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SERVICES } from "@/data/content";

export const Services = () => {
  const [active, setActive] = useState(null);

  return (
    <section id="services" className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="max-w-2xl mb-14">
          <p className="text-[#D4AF37] text-xs md:text-sm tracking-[0.25em] uppercase font-semibold mb-4">
            Our Treatments
          </p>
          <h2 className="font-serif-display text-3xl md:text-4xl lg:text-5xl font-light text-[#1C3F35] leading-tight">
            A curated menu of therapeutic care
          </h2>
          <p className="mt-5 text-[#4A554D] text-base md:text-lg">
            From signature massages to specialized therapies — each session is tailored to
            relieve, restore and rejuvenate.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {SERVICES.map((s, i) => {
            const Icon = Icons[s.icon] || Icons.Sparkles;
            return (
              <motion.button
                key={s.id}
                data-testid={`service-card-${s.id}`}
                onClick={() => setActive(s)}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                className="group text-left bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-[#1C3F35]/5 transition-all duration-400 hover:-translate-y-1.5 flex flex-col"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={s.image}
                    alt={s.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C3F35]/40 to-transparent" />
                  <span className="absolute top-4 left-4 w-11 h-11 rounded-full bg-[#FAF7F2]/95 flex items-center justify-center shadow">
                    <Icon size={20} className="text-[#1C3F35]" />
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-serif-display text-2xl text-[#1C3F35]">{s.name}</h3>
                  <p className="mt-2 text-sm text-[#4A554D] leading-relaxed flex-1">{s.short}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#1C3F35] group-hover:text-[#D4AF37] transition-colors">
                    Learn more
                    <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent
          data-testid="service-detail-dialog"
          className="max-w-lg p-0 overflow-hidden bg-[#FAF7F2] border-[#1C3F35]/10"
        >
          {active && (
            <>
              <img src={active.image} alt={active.name} className="w-full h-56 object-cover" />
              <div className="p-7">
                <DialogHeader>
                  <DialogTitle className="font-serif-display text-3xl font-normal text-[#1C3F35] text-left">
                    {active.name}
                  </DialogTitle>
                  <DialogDescription className="text-left text-[#4A554D] text-base leading-relaxed pt-3">
                    {active.long}
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[30, 60, 90, 120].map((d) => (
                    <span key={d} className="text-xs px-3 py-1.5 rounded-full bg-[#8EAC9A]/15 text-[#1C3F35]">
                      {d} min
                    </span>
                  ))}
                </div>
                <button
                  data-testid="service-dialog-book-btn"
                  onClick={() => {
                    setActive(null);
                    setTimeout(
                      () => document.querySelector("#booking")?.scrollIntoView({ behavior: "smooth" }),
                      120
                    );
                  }}
                  className="mt-7 w-full bg-[#1C3F35] text-[#FAF7F2] py-3.5 rounded-full font-medium hover:bg-[#D4AF37] hover:text-[#1C3F35] transition-all duration-300"
                >
                  Book {active.name}
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
