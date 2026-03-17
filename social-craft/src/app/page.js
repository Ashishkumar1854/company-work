// ============================================
// FILE: page.js
// PURPOSE: Assembles the Social Craft homepage sections in the required order
// USES: homepage section components
// ============================================

import Hero from "@/components/sections/Hero";
import Clients from "@/components/sections/Clients";
import Services from "@/components/sections/Services";
import Portfolio from "@/components/sections/Portfolio";
import Testimonials from "@/components/sections/Testimonials";
import BookingForm from "@/components/sections/BookingForm";

export const metadata = {
  title: "Creative Agency for Design, Marketing & Web",
  description:
    "Social Craft builds graphics, video editing, social media systems, digital campaigns, and websites for brands that want consistent growth.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <>
      {/* ── Section: Homepage Hero ── */}
      <Hero />

      {/* ── Section: Homepage Clients ── */}
      <Clients />

      {/* ── Section: Homepage Services ── */}
      <Services />

      {/* ── Section: Homepage Portfolio ── */}
      <Portfolio />

      {/* ── Section: Homepage Testimonials ── */}
      <Testimonials />

      {/* ── Section: Homepage Booking Form ── */}
      <BookingForm />
    </>
  );
}
