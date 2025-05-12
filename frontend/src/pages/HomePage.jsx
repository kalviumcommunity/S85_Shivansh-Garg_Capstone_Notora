import Navbar from "../components/Navbarr";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
import Background from "../components/Background";

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-gradient-to-br from-[#01030f] via-[#1b264f] to-[#01030f] text-white overflow-auto">
      <Navbar />
      <Background />
      <div className="relative z-10">
        <Hero />
        <Features />
        <Testimonials />
        <CTA />
        <Footer />
      </div>
    </main>
  );
}
