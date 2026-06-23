import { motion } from "framer-motion";
import { Star, MapPin, ArrowUpRight } from "lucide-react";
import { BUSINESS, IMAGES } from "@/data/content";

export const GoogleTrust = () => {
  return (
    <section className="py-20 md:py-28 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-[#D4AF37] text-xs md:text-sm tracking-[0.25em] uppercase font-semibold mb-4">
            Find Us On Google
          </p>
          <h2 className="font-serif-display text-3xl md:text-4xl lg:text-5xl font-light text-[#1C3F35] leading-tight">
            Chennai's most-loved <span className="italic">massage spa</span>
          </h2>

          <div className="mt-7 flex items-center gap-4">
            <span className="font-serif-display text-5xl text-[#1C3F35]">{BUSINESS.rating}</span>
            <div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} className="text-[#D4AF37] fill-[#D4AF37]" />
                ))}
              </div>
              <p className="text-sm text-[#4A554D] mt-1">Based on {BUSINESS.reviews} Google reviews</p>
            </div>
          </div>

          <p className="mt-7 text-[#4A554D] text-base md:text-lg leading-relaxed max-w-lg">
            Rated 4.8★ by Chennai families, Green Tara Wellness is recognised on Google as a
            premier massage spa in Valasaravakkam. Search “Green Tara Wellness” to read our
            reviews, view photos and get directions.
          </p>

          <div className="mt-7 flex items-start gap-3 text-[#1C3F35]">
            <MapPin size={20} className="text-[#D4AF37] mt-0.5 flex-shrink-0" />
            <p className="text-sm leading-relaxed">
              {BUSINESS.addressLine1}, {BUSINESS.addressLine2}, {BUSINESS.addressLine3}
            </p>
          </div>

          <a
            data-testid="google-directions-btn"
            href={BUSINESS.mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 bg-[#1C3F35] text-[#FAF7F2] px-7 py-3.5 rounded-full font-medium hover:bg-[#D4AF37] hover:text-[#1C3F35] transition-all duration-300"
          >
            Get Directions <ArrowUpRight size={17} />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="flex justify-center"
        >
          <img
            src={IMAGES.googleMobile}
            alt="Green Tara Wellness Google Business listing"
            className="w-full max-w-md object-contain drop-shadow-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
};
