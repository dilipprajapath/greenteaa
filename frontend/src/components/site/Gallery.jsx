import { motion } from "framer-motion";
import { IMAGES } from "@/data/content";

const GALLERY = [
  { src: IMAGES.hallway, alt: "Green Tara Wellness serene entrance hallway", span: "row-span-2" },
  { src: IMAGES.steamRoom, alt: "Private steam bath chamber", span: "" },
  { src: IMAGES.aboutMural, alt: "Relaxation lounge with Green Tara mural", span: "" },
  { src: IMAGES.steamDoor, alt: "Steam room glass door with golden lotus emblem", span: "row-span-2" },
];

export const Gallery = () => {
  return (
    <section id="gallery" className="py-20 md:py-32 bg-[#1C3F35]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="max-w-2xl mb-12">
          <p className="text-[#D4AF37] text-xs md:text-sm tracking-[0.25em] uppercase font-semibold mb-4">
            Inside Our Sanctuary
          </p>
          <h2 className="font-serif-display text-3xl md:text-4xl lg:text-5xl font-light text-[#FAF7F2] leading-tight">
            Step into a space designed for stillness
          </h2>
          <p className="mt-5 text-[#FAF7F2]/70 text-base md:text-lg">
            Real moments from Green Tara Wellness — soft lighting, lush greenery and
            thoughtfully crafted healing spaces.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 auto-rows-[180px] md:auto-rows-[240px] gap-4">
          {GALLERY.map((g, i) => (
            <motion.div
              key={g.alt}
              data-testid={`gallery-image-${i}`}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className={`relative overflow-hidden rounded-2xl group ${g.span}`}
            >
              <img
                src={g.src}
                alt={g.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#1C3F35]/0 group-hover:bg-[#1C3F35]/20 transition-colors duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
