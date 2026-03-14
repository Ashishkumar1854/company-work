"use client";

// ============================================
// FILE: Testimonials.jsx
// PURPOSE: Shows client reviews to reinforce delivery quality and trust
// USES: framer-motion, Card, testimonialsData
// ============================================

import { motion } from "framer-motion";
import Card from "@/components/ui/Card";
import { testimonialsData } from "@/lib/constants";

const motionProps = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
  viewport: { once: true },
};

export default function Testimonials() {
  return (
    <motion.section {...motionProps} className="py-20">
      {/* ── Section: Testimonials Container ── */}
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 max-w-2xl space-y-3">
          {/* ── Section: Testimonials Heading ── */}
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-muted">
            Social proof
          </p>
          <h2>Customer Reviews</h2>
          <p className="text-base leading-7 text-gray-muted">
            Trust earned with consistent delivery
          </p>
        </div>

        {/* ── Section: Testimonials Grid ── */}
        <div className="grid gap-6 lg:grid-cols-3">
          {testimonialsData.map((item) => (
            <Card key={item.id}>
              <div className="h-full p-6">
                {/* ── Section: Rating Row ── */}
                <p className="text-lg tracking-[0.2em] text-brand">{"★".repeat(item.rating)}</p>
                <p className="mt-4 font-serif text-[3rem] leading-none text-brand/20">
                  &ldquo;
                </p>
                <p className="mt-2 text-base leading-8 text-gray-body">
                  {item.reviewText}
                </p>
                <div className="mt-8 border-t border-black/10 pt-5">
                  <p className="font-bold text-ink">{item.clientName}</p>
                  <p className="mt-1 text-sm text-gray-muted">{item.serviceType}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
