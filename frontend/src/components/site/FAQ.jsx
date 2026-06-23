import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQS } from "@/data/content";

export const FAQ = () => {
  return (
    <section id="faq" className="py-20 md:py-32 bg-[#8EAC9A]/10">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-[#D4AF37] text-xs md:text-sm tracking-[0.25em] uppercase font-semibold mb-4">
            Good to Know
          </p>
          <h2 className="font-serif-display text-3xl md:text-4xl lg:text-5xl font-light text-[#1C3F35] leading-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((f, i) => (
            <AccordionItem
              key={f.q}
              value={`faq-${i}`}
              data-testid={`faq-item-${i}`}
              className="border-b border-[#1C3F35]/12"
            >
              <AccordionTrigger className="text-left font-serif-display text-lg md:text-xl text-[#1C3F35] hover:no-underline py-5">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-[#4A554D] text-base leading-relaxed pb-5">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
