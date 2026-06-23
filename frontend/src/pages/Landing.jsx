import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Services } from "@/components/site/Services";
import { Gallery } from "@/components/site/Gallery";
import { Booking } from "@/components/site/Booking";
import { GoogleTrust } from "@/components/site/GoogleTrust";
import { Testimonials } from "@/components/site/Testimonials";
import { FAQ } from "@/components/site/FAQ";
import { Footer } from "@/components/site/Footer";
import { FloatingActions } from "@/components/site/FloatingActions";

export default function Landing() {
  return (
    <div className="bg-[#FAF7F2] overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Gallery />
        <Booking />
        <GoogleTrust />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
