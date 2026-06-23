import { motion } from "framer-motion";
import { ShieldCheck, Sparkles, Users, Leaf } from "lucide-react";
import { BUSINESS, IMAGES } from "@/data/content";

const HIGHLIGHTS = [
  { icon: ShieldCheck, label: "Expert Therapists" },
  { icon: Sparkles, label: "Advanced Techniques" },
  { icon: Users, label: "500+ Happy Clients" },
  { icon: Leaf, label: "Premium Organic Products" },
];

export const About = () => {
  return (
    <section id="about" className="py-20 md:py-32 bg-[#8EAC9A]/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="overflow-hidden rounded-[2rem] rounded-tr-[7rem] shadow-2xl">
            <img
              src={IMAGES.aboutMural}
              alt="Green Tara Wellness interior with the Green Tara mural"
              className="w-full h-[440px] md:h-[560px] object-cover"
            />
          </div>
          <div className="absolute -bottom-7 -left-4 md:-left-8 bg-[#1C3F35] text-[#FAF7F2] rounded-2xl px-7 py-5 shadow-xl">
            <p className="font-serif-display text-4xl text-[#D4AF37] leading-none">{BUSINESS.rating}★</p>
            <p className="text-xs tracking-wide mt-1 text-[#FAF7F2]/80">{BUSINESS.reviews} Google reviews</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <p className="text-[#D4AF37] text-xs md:text-sm tracking-[0.25em] uppercase font-semibold mb-4">
            Our Story
          </p>
          <h2 className="font-serif-display text-3xl md:text-4xl lg:text-5xl font-light text-[#1C3F35] leading-tight">
            Inspired by the compassionate <span className="italic">Green Tara</span>
          </h2>
          <div className="mt-6 space-y-5 text-[#4A554D] text-base md:text-lg leading-relaxed">
            <p>
              Named after the compassionate Green Tara — a timeless symbol of protection,
              swift healing and motherly care — our spa was born from a simple belief: that
              every guest deserves a sanctuary to escape the demands of modern life.
            </p>
            <p>
              From chronic pain and stress to the quiet need for restoration, our expert
              therapists blend ancient wisdom with advanced techniques and premium organic
              products. This is your stress-relief zone, nestled in the heart of Valasaravakkam, Chennai.
            </p>
          </div>

          <div className="mt-9 grid grid-cols-2 gap-4">
            {HIGHLIGHTS.map((h) => (
              <div
                key={h.label}
                data-testid={`highlight-${h.label.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                className="flex items-center gap-3 bg-white rounded-xl px-4 py-4 border border-[#1C3F35]/5 shadow-sm"
              >
                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-[#1C3F35]/5 flex items-center justify-center">
                  <h.icon size={19} className="text-[#1C3F35]" />
                </span>
                <span className="text-sm font-medium text-[#1C3F35] leading-tight">{h.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
